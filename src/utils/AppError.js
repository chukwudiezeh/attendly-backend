const { statusCodes } = require('../configs/constants');

class AppError extends Error {
  constructor(message, statusCode = statusCodes.serverError) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError; 