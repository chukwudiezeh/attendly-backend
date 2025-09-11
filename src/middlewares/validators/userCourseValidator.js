const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

const registerCoursesSchema = Joi.object({
  academicYear: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid academic year ID format',
      'string.length': 'Invalid academic year ID format',
      'any.required': 'Academic year ID is required'
    }),
  department: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid department ID format',
      'string.length': 'Invalid department ID format',
      'any.required': 'Department ID is required'
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
  curriculumCourses: Joi.array()
    .items(
      Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.hex': 'Invalid course ID format',
        'string.length': 'Invalid course ID format',
        'any.required': 'Course ID is required'
      }),
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one course is required',
      'any.required': 'Courses array is required'
    }),
  curriculumCourseRole: Joi.string()
    .valid('student', 'lecturer', 'lecturer_secondary', 'lecturer_assistant', 'course_representative')
    .required()
    .messages({
      'any.only': 'Invalid course role',
      'any.required': 'Course role is required'
    })
}).options({ abortEarly: true });

const getUserCoursesSchema = Joi.object({
  userId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid user ID format',
      'string.length': 'Invalid user ID format',
      'any.required': 'User ID is required'
    }),
  academicYear: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      'string.hex': 'Invalid academic year ID format',
      'string.length': 'Invalid academic year ID format'
    }),
  level: Joi.number()
    .valid(100, 200, 300, 400, 500, 600)
    .optional()
    .messages({
      'any.only': 'Level must be one of [100, 200, 300, 400, 500, 600]'
    }),
  semester: Joi.string()
    .valid('first', 'second')
    .optional()
    .messages({
      'any.only': 'Semester must be either "first" or "second"'
    })
}).options({ abortEarly: true });

const validateRegisterCourses = (req, res, next) => {
  const { error } = registerCoursesSchema.validate(req.body);
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

const validateGetUserCourses = (req, res, next) => {
  const { error } = getUserCoursesSchema.validate(req.query);
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

module.exports = {
  validateRegisterCourses,
  validateGetUserCourses
}; 