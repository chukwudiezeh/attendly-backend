const Joi = require('joi');
const { errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

const facultyIdSchema = Joi.object({
  facultyId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      'string.hex': 'Invalid faculty ID format',
      'string.length': 'Invalid faculty ID format',
      'any.required': 'Faculty ID is required'
    })
}).options({ abortEarly: true });

exports.validateFacultyId = (req, res, next) => {
  const { error } = facultyIdSchema.validate(req.params);
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