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

// Create/Update curriculum schema
const createUpdateSchema = Joi.object({
  department: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid department ID format',
      'string.length': 'Invalid department ID format',
      'any.required': 'Department ID is required'
    }),
  courses: Joi.array()
    .items(courseSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one course is required',
      'any.required': 'Courses array is required'
    })
}).options({ abortEarly: true });

// Add courses schema
const addCoursesSchema = Joi.object({
  courses: Joi.array()
    .items(courseSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one course is required',
      'any.required': 'Courses array is required'
    })
}).options({ abortEarly: true });

// Remove courses schema
const removeCoursesSchema = Joi.object({
  courseIds: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
        .messages({
          'string.hex': 'Invalid course ID format',
          'string.length': 'Invalid course ID format'
        })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one course ID is required',
      'any.required': 'Course IDs array is required'
    })
}).options({ abortEarly: true });

// Query params schema for getting level courses
const getLevelCoursesSchema = Joi.object({
  level: Joi.number()
    .valid(100, 200, 300, 400, 500, 600)
    .messages({
      'any.only': 'Level must be one of [100, 200, 300, 400, 500, 600]'
    }),
  semester: Joi.string()
    .valid('first', 'second')
    .messages({
      'any.only': 'Semester must be either "first" or "second"'
    })
});

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
  validateCreateUpdate: (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return errorResponse(
        res,
        null,
        statusCodes.badRequest,
        'Request body is empty'
      );
    }

    const { error } = createUpdateSchema.validate(req.body);
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
  
  validateAddCourses: (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return errorResponse(
        res,
        null,
        statusCodes.badRequest,
        'Request body is empty'
      );
    }

    const { error } = addCoursesSchema.validate(req.body);
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
  
  validateRemoveCourses: (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return errorResponse(
        res,
        null,
        statusCodes.badRequest,
        'Request body is empty'
      );
    }

    const { error } = removeCoursesSchema.validate(req.body);
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
  
  validateGetLevelCourses: (req, res, next) => {
    const { level, semester } = req.query;
    
    if (level) {
      const parsedLevel = parseInt(level);
      if (![100, 200, 300, 400, 500, 600].includes(parsedLevel)) {
        return errorResponse(
          res,
          null,
          statusCodes.badRequest,
          'Level must be one of [100, 200, 300, 400, 500, 600]'
        );
      }
    }

    if (semester && !['first', 'second'].includes(semester)) {
      return errorResponse(
        res,
        null,
        statusCodes.badRequest,
        'Semester must be either "first" or "second"'
      );
    }

    next();
  },
  
  validateDepartmentId: (req, res, next) => {
    const { departmentId } = req.params;

    if (!departmentId || !departmentId.match(/^[0-9a-fA-F]{24}$/)) {
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