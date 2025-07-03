const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

const createCourseSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.empty': 'Course name is required',
      'string.min': 'Course name must be at least 3 characters long',
      'string.max': 'Course name cannot exceed 100 characters',
      'any.required': 'Course name is required'
    }),
  code: Joi.string()
    .required()
    .trim()
    .uppercase()
    .pattern(/^[A-Z]{3}[0-9]{3}$/)
    .messages({
      'string.empty': 'Course code is required',
      'string.pattern.base': 'Course code must be in format ABC123',
      'any.required': 'Course code is required'
    }),
  unit: Joi.number()
    .required()
    .min(1)
    .messages({
      'number.base': 'Course unit must be a number',
      'number.min': 'Course unit must be at least 1',
      'any.required': 'Course unit is required'
    }),
  department: Joi.string()
    .required()
    .hex()
    .length(24)
    .messages({
      'string.hex': 'Invalid department ID format',
      'string.length': 'Invalid department ID format',
      'any.required': 'Department is required'
    }),
  level: Joi.number()
    .required()
    .min(100)
    .max(700)
    .messages({
      'number.base': 'Level must be a number',
      'number.min': 'Level must be at least 100',
      'number.max': 'Level cannot exceed 700',
      'any.required': 'Level is required'
    }),
  status: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'any.only': 'Status must be either active or inactive'
    })
}).options({ abortEarly: true });

const updateCourseSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Course name must be at least 3 characters long',
      'string.max': 'Course name cannot exceed 100 characters'
    }),
  unit: Joi.number()
    .min(1)
    .messages({
      'number.base': 'Course unit must be a number',
      'number.min': 'Course unit must be at least 1'
    }),
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.only': 'Status must be either active or inactive'
    })
}).min(1).options({ abortEarly: true });

exports.validateCreateCourse = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = createCourseSchema.validate(req.body);
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

exports.validateUpdateCourse = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(
      res,
      null,
      statusCodes.badRequest,
      'Request body is empty'
    );
  }

  const { error } = updateCourseSchema.validate(req.body);
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