const joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const jwtservice = require("../../services/JsonWebToken");
const { User,RefreshToken } = require("../../models");
const { REFRESH_SECRET } = require("../../config");
module.exports = {
  login: async (req, res, next) => {
    // validation
    const loginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi
        .string()
        .min(6)
        .max(20)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { email, password } = req.body;
    const { error } = loginSchema.validate({ email, password });

    if (error) {
      return next(error);
    }

    // check email in database or not
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      } else {
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
          return next(CustomErrorHandler.wrongCredentials());
        }

        // generate token
        const accessToken = jwtservice.sign({
          _id: user._id,
          role: user.role,
        });
        const refreshToken = jwtservice.sign(
           {
             _id: user._id,
             role: user.role,
           },
           "1y",
           REFRESH_SECRET
         );

          // save refreshtoken
          await RefreshToken.create({
            token: refreshToken,
          });
        res.status(200).json({
          msg: "login successfully",
          accessToken,
          refreshToken,
        });
      }
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    // validation
    const refreshSchema = joi.object({
      token: joi.string().required(),
    });

    let { token } = req.body;

    const { error } = refreshSchema.validate({ token });

    if (error) {
      return next(error);
    }
    try {
      await RefreshToken.deleteOne({token});
    } catch (error) {
      return next(error);
    }

    res.json({msg:"user logout successfully"});
  },
};
