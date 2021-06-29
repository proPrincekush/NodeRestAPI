class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "email or password is wrong.") {
    return new CustomErrorHandler(401, message);
  }

  static unauthorize(message = "unauthorize") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "not found") {
    return new CustomErrorHandler(404, message);
  }

  static serverError(message = "internal server error") {
    return new CustomErrorHandler(500, message);
  }
  
}

module.exports = CustomErrorHandler;
