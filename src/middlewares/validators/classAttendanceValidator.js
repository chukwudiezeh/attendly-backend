const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

// Validation Schemas
const createClassAttendanceSchema = Joi.object({
  user: Joi.string().required(),
  class: Joi.string().required(),
  checkInTime: Joi.date(),
  checkOutTime: Joi.date(),
  status: Joi.string().valid('present', 'absent', 'late', 'excused')
});

const updateClassAttendanceSchema = Joi.object({
  checkInTime: Joi.date(),
  checkOutTime: Joi.date(),
  status: Joi.string().valid('present', 'absent', 'late', 'excused')
});

// Validation Middleware Methods
const validateCreateClassAttendance = (req, res, next) => {
  const { error } = createClassAttendanceSchema.validate(req.body);
  if (error) {
    return errorResponse(res, error.details[0].message, statusCodes.badRequest);
  }
  next();
};

const validateUpdateClassAttendance = (req, res, next) => {
  const { error } = updateClassAttendanceSchema.validate(req.body);
  if (error) {
    return errorResponse(res, error.details[0].message, statusCodes.badRequest);
  }
  next();
};

module.exports = {
  validateCreateClassAttendance,
  validateUpdateClassAttendance
}; 