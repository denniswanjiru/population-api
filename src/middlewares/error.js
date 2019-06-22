export default class ErrorHandler {
  static customError(req, res, next) {
    const error = new Error('Route does not exist');
    error.status = 404;
    next(error);
  };

  static handleError(error, req, res, next) {
    res.status(error.status || 500).json({
      error: {
        message: error.message
      }
    });
    next();
  }
}
