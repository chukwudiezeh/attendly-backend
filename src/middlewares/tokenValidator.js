const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');
const config = require('../configs/app');
const User = require('../models/User');

/**
 * Validates JWT token from Authorization header
 * Adds user object to request if token is valid
 */
const validateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(
        res,
        null,
        statusCodes.unauthorized,
        'No token provided'
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(
        res,
        null,
        statusCodes.unauthorized,
        'Invalid token format'
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Get user from database
      const user = await User.findById(decoded.id);
      if (!user) {
        return errorResponse(
          res,
          null,
          statusCodes.unauthorized,
          'Unauthorized! Invalid user'
        );
      }

      // Add user to request object
      req.user = {
        _id: user._id,
        email: user.email,
        role: user.role
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return errorResponse(
          res,
          null,
          statusCodes.unauthorized,
          'Unauthorized! Token has expired'
        );
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        return errorResponse(
          res,
          null,
          statusCodes.unauthorized,
          'Unauthorized! Invalid token'
        );
      }

      throw error;
    }
  } catch (error) {
    return errorResponse(
      res,
      error,
      statusCodes.serverError,
      'Error validating token'
    );
  }
};

module.exports = {
  validateToken
}; 