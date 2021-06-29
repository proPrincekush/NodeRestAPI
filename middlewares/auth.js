const CustomErrorHandler = require("../services/CustomErrorHandler");
const Jwt = require("../services/JsonWebToken");

module.exports = async (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) {
    return next(CustomErrorHandler.unauthorize());
  }

  const token = authheader.split(" ")[1];
  try {
    const { _id, role } = await Jwt.verify(token);
    req.user = { _id, role };
    return next();
  } catch (error) {
    return next(CustomErrorHandler.unauthorize());
  }
};
