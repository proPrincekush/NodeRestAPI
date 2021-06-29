const joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt");
const jwtservice = require("../../services/JsonWebToken");
const { User } = require("../../models");

module.exports = {
  user: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );

      if (!user) {
        next(CustomErrorHandler.notFound());
      } else {
        res.json(user);
      }
    } catch (err) {
      return next(err);
    }
  },
};
