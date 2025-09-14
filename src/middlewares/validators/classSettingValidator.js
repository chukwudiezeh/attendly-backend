const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

const classSettingSchema = Joi.object({
  curriculumCourse: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid course ID format',
      'string.length': 'Invalid course ID format',
      'any.required': 'Course ID is required'
    }),
    recurringClasses: Joi.boolean().optional(),
    autoCreateClass: Joi.boolean().optional(),
    shouldSendNotifications: Joi.boolean().optional(),
    notificationTimes: Joi.array().items(
      Joi.number().integer().min(-60).max(120).messages({
        'number.base': 'Notification time must be a number',
        'number.integer': 'Notification time must be an integer',
        'number.min': 'Notification time cannot be less than -60 minutes',
        'number.max': 'Notification time cannot exceed 120 minutes'
      })
    ).optional().messages({
      'array.base': 'Notification times must be an array'
    }),
  attendanceWindow: Joi.number()
    .min(0)
    .optional()
    .default(15)
    .messages({
      'number.min': 'Attendance window must be greater than 0',
    }),
  attendancePassMark: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .default(75)
    .messages({
      'number.min': 'Attendance window must be greater than 0',
    }),
  attendancePassMark: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .default(75)
    .messages({
      'number.min': 'Attendance pass mark must be between 0 and 100',
      'number.max': 'Attendance pass mark must be between 0 and 100'
    }),
    allowedRadius: Joi.number().min(1).max(1000).required(),

}).options({ abortEarly: true });

const updateClassSettingSchema = Joi.object({
  curriculumCourse: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      'string.hex': 'Invalid course ID format',
      'string.length': 'Invalid course ID format'
    }),
  allowedRadius: Joi.number().min(1).max(1000).optional(),
  attendancePassMark: Joi.number().min(0).max(100).optional(),
  attendanceWindow: Joi.number().min(0).optional(),
  recurringClasses: Joi.boolean().optional(),
  autoCreateClass: Joi.boolean().optional(),
  shouldSendNotifications: Joi.boolean().optional(),
  notificationTimes: Joi.array().items(
    Joi.number().integer().min(-60).max(120).messages({
      'number.base': 'Notification time must be a number',
      'number.integer': 'Notification time must be an integer',
      'number.min': 'Notification time cannot be less than -60 minutes',
      'number.max': 'Notification time cannot exceed 120 minutes'
    })
  ).optional().messages({
    'array.base': 'Notification times must be an array'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const validateCreateClassSetting = (req, res, next) => {
  const { error } = classSettingSchema.validate(req.body);
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

const validateUpdateClassSetting = (req, res, next) => {
  const { error } = updateClassSettingSchema.validate(req.body, { allowUnknown: true });
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

const validateId = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'Invalid ID format',
        'any.required': 'ID is required'
      })
  });

  const { error } = schema.validate(req.params);
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

const validateCourseId = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.hex': 'Invalid course ID format',
        'string.length': 'Invalid course ID format',
        'any.required': 'Course ID is required'
      })
  });

  const { error } = schema.validate(req.params);
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
  validateCreateClassSetting,
  validateUpdateClassSetting,
  validateId,
  validateCourseId
};