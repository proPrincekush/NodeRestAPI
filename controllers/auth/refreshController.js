const joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const jwtservice = require("../../services/JsonWebToken");
const { User, RefreshToken } = require("../../models");
const { REFRESH_SECRET } = require("../../config");
module.exports = {
  refresh: async (req, res, next) => {
    // validation
    const refreshSchema = joi.object({
      token: joi.string().required(),
    });

    let { token } = req.body;

    const { error } = refreshSchema.validate({ token });

    if (error) {
      return next(error);
    }

    let userid = "";
    try {
      const myRefreshToken = await RefreshToken.findOneAndDelete({
        token,
      });

      console.log(myRefreshToken);
      if (!myRefreshToken) {
        return next(CustomErrorHandler.unauthorize("invalid refresh token"));
      }

      
      try {
        const { _id } = await jwtservice.verify(
          myRefreshToken.token,
          REFRESH_SECRET
        );

        userid = _id;
      } catch (error) {
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //    verify user
    const user = await User.findOne({ _id: userid });
    if (!user) {
      return next(CustomErrorHandler.unauthorize("no user found"));
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

    await RefreshToken.create({ token: refreshToken });
    res.status(201).json({
      msg: "new token generated",
      accessToken,
      refreshToken,
    });
  },
};
