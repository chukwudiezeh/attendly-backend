const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

const registerStudentSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'First name is required',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
  matricNumber: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Matric number is required',
      'any.required': 'Matric number is required'
    }),
  department: Joi.string()
    .required()
    .hex()
    .length(24)
    .messages({
      'string.hex': 'Invalid department ID format',
      'string.length': 'Invalid department ID format',
      'any.required': 'Department is required'
    })
}).options({ abortEarly: true });

const registerLecturerSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'First name is required',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Last name is required',
      'any.required': 'Last name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    }),
  department: Joi.string()
    .required()
    .hex()
    .length(24)
    .messages({
      'string.hex': 'Invalid department ID format',
      'string.length': 'Invalid department ID format',
      'any.required': 'Department is required'
    })
}).options({ abortEarly: true });

const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Email or matric number is required',
      'any.required': 'Email or matric number is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
}).options({ abortEarly: true });

const verifyTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .length(6)
    .pattern(/^[0-9]+$/)
    .messages({
      'string.empty': 'Verification token is required',
      'string.length': 'Verification token must be 6 digits',
      'string.pattern.base': 'Verification token must contain only numbers',
      'any.required': 'Verification token is required'
    })
}).options({ abortEarly: true });

const forgotPasswordSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Please enter your login credentials',
      'any.required': 'Please enter your login credentials'
    })
}).options({ abortEarly: true });

const verifyResetTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .length(6)
    .pattern(/^[0-9]+$/)
    .messages({
      'string.empty': 'Verification token is required',
      'string.length': 'Verification token must be 6 digits',
      'string.pattern.base': 'Verification token must contain only numbers',
      'any.required': 'Verification token is required'
    }),
  identifier: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Please enter your login credentials',
      'any.required': 'Please enter your login credentials'
    })
}).options({ abortEarly: true });

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .length(6)
    .pattern(/^[0-9]+$/)
    .messages({
      'string.empty': 'Verification token is required',
      'string.length': 'Verification token must be 6 digits',
      'string.pattern.base': 'Verification token must contain only numbers',
      'any.required': 'Verification token is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
}).options({ abortEarly: true });

exports.validateStudentRegistration = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res, 
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = registerStudentSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
};

exports.validateLecturerRegistration = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = registerLecturerSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
};

exports.validateVerifyToken = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = verifyTokenSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
};

exports.validateForgotPassword = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
};

exports.validateVerifyResetToken = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = verifyResetTokenSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
};

exports.validateResetPassword = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return errorResponse(
      res,
      error,
      statusCodes.badRequest,
      error.details[0].message
    );
  }
  next();
}; 