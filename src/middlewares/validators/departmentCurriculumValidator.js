const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

// Schema for course object within curriculum
const courseSchema = Joi.object({
  course: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid course ID format',
      'string.length': 'Invalid course ID format',
      'any.required': 'Course ID is required'
    }),
  level: Joi.number()
    .valid(100, 200, 300, 400, 500, 600)
    .required()
    .messages({
      'any.only': 'Level must be one of [100, 200, 300, 400, 500, 600]',
      'any.required': 'Level is required'
    }),
  semester: Joi.string()
    .valid('first', 'second')
    .required()
    .messages({
      'any.only': 'Semester must be either "first" or "second"',
      'any.required': 'Semester is required'
    }),
  courseType: Joi.string()
    .valid('core', 'elective', 'general')
    .required()
    .messages({
      'any.only': 'Course type must be one of [core, elective, general]',
      'any.required': 'Course type is required'
    }),
  creditUnits: Joi.number()
    .min(1)
    .max(6)
    .required()
    .messages({
      'number.min': 'Credit units must be at least 1',
      'number.max': 'Credit units cannot exceed 6',
      'any.required': 'Credit units is required'
    })
}).options({ abortEarly: true });

// Query params schema for getting level courses
const getLevelCoursesSchema = Joi.object({
  level: Joi.number()
    .valid(100, 200, 300, 400, 500, 600)
    .required()
    .messages({
      'any.only': 'Level must be one of [100, 200, 300, 400, 500, 600]',
      'any.required': 'Level is required'
    }),
  semester: Joi.string()
    .valid('first', 'second')
    .required()
    .messages({
      'any.only': 'Semester must be either "first" or "second"',
      'any.required': 'Semester is required'
    })
}).options({ abortEarly: true });

// Department ID param schema
const departmentIdSchema = Joi.object({
  departmentId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid department ID format',
      'string.length': 'Invalid department ID format',
      'any.required': 'Department ID is required'
    })
});

// Export validation middlewares
module.exports = {
  validateGetLevelCourses: (req, res, next) => {
    const { error } = getLevelCoursesSchema.validate(req.query);
    if (error) {
      return errorResponse(
        res,
        error,
        statusCodes.badRequest,
        error.details[0].message
      );
    }
    next();
  },
  
  validateDepartmentId: (req, res, next) => {
    const { error } = departmentIdSchema.validate(req.params);
    if (error) {
      return errorResponse(
        res,
        null,
        statusCodes.badRequest,
        'Invalid department ID format'
      );
    }

    next();
  }
}; 