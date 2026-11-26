// Throw this anywhere (service, controller, middleware) and the error
// middleware turns it into: res.status(status).json({ success: false, error })
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

module.exports = ApiError;
