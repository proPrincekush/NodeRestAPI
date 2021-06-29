const CustomErrorHandler = require("../services/CustomErrorHandler");
module.exports = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    next(CustomErrorHandler.unauthorize("only admin is allowed"));
  }
};
