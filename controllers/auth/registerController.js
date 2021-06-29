const joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const jwtservice = require("../../services/JsonWebToken");
const { User, RefreshToken } = require("../../models");
const { REFRESH_SECRET } = require("../../config");
module.exports = {
  async register(req, res, next) {
    // validation schema
    const registerSchema = joi.object({
      fullname: joi.string().min(3).max(30).required(),
      email: joi.string().email().required(),
      password: joi
        .string()
        .min(6)
        .max(20)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: joi.ref("password"),
    });

    // handleError
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { email, password, fullname } = req.body;
    let accessToken = "";
    let refreshToken = "";
    // user already in database
    try {
      const exists = await User.exists({ email });
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken.")
        );
      }
    } catch (err) {
      next(err);
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      const result = await User.create({
        fullname,
        email,
        password: hashedPassword,
      });

      // create jwt tokens
      accessToken = jwtservice.sign({
        _id: result._id,
        role: result.role,
      });

      refreshToken = jwtservice.sign(
        {
          _id: result._id,
          role: result.role,
        },
        "1y",
        REFRESH_SECRET
      );

      const refresh = await RefreshToken.create({
        token: refreshToken,
      });
    } catch (err) {
      return next(err);
    }

    res.status(201).json({
      msg: "Successfully Registered.",
      accessToken,
      refreshToken,
    });
  },
};
