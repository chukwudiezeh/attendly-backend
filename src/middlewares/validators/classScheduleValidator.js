const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

// Validation Schemas
const locationSchema = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required()
});

const createClassScheduleSchema = Joi.object({
  curriculumCourse: Joi.string().required(),
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  location: Joi.string().required()
});

const updateClassScheduleSchema = Joi.object({
  curriculumCourse: Joi.string(),
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  startTime: Joi.string(),
  endTime: Joi.string(),
  locationCoordinates: locationSchema,
  locationName: Joi.string()
});

const validateCreateClassSchedule = (req, res, next) => {
  const { error } = createClassScheduleSchema.validate(req.body);
  if (error) {
    return errorResponse(res, error.details[0].message, statusCodes.badRequest);
  }
  next();
};

const validateUpdateClassSchedule = (req, res, next) => {
  const { error } = updateClassScheduleSchema.validate(req.body);
  if (error) {
    return errorResponse(res, error.details[0].message, statusCodes.badRequest);
  }
  next();
};

module.exports = {
  validateCreateClassSchedule,
  validateUpdateClassSchedule
}; 