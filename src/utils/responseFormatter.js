const { statusCodes } = require('../configs/constants');

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {any} data - The data to be returned
 * @param {number} [statusCode=200] - HTTP status code
 * @param {string} [message='Success'] - Success message
 */
const successResponse = (
  res,
  data = null,
  statusCode = statusCodes.ok,
  message = 'Success'
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string|Error} error - Error message or Error object
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [message='An error occurred'] - Error message
 */
const errorResponse = (
  res,
  error,
  statusCode = statusCodes.serverError,
  message = 'An error occurred'
) => {
  return res.status(statusCode).json({
    success: false,
    message: message || (error instanceof Error ? error.message : error),
    data: null
  });
};

module.exports = {
  successResponse,
  errorResponse
}; 