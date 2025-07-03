const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');
const UtilityService = require('../services/utilityService');

/**
 * @desc    Get all academic years
 * @route   GET /api/v1/utilities/academic-years
 * @access  Public
 */
exports.getAcademicYears = async (req, res) => {
  try {
    const academicYears = await UtilityService.getAcademicYears();

    return successResponse(
      res,
      academicYears,
      statusCodes.ok,
      'Academic years retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      res,
      error,
      statusCodes.serverError,
      'Error retrieving academic years'
    );
  }
};

/**
 * @desc    Get all faculties
 * @route   GET /api/v1/utilities/faculties
 * @access  Public
 */
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await UtilityService.getFaculties();

    return successResponse(
      res,
      faculties,
      statusCodes.ok,
      'Faculties retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      res,
      error,
      statusCodes.serverError,
      'Error retrieving faculties'
    );
  }
};

/**
 * @desc    Get departments by faculty
 * @route   GET /api/v1/utilities/faculties/:facultyId/departments
 * @access  Public
 */
exports.getDepartmentsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const departments = await UtilityService.getDepartmentsByFaculty(facultyId);

    return successResponse(
      res,
      departments,
      statusCodes.ok,
      'Departments retrieved successfully'
    );
  } catch (error) {
    return errorResponse(
      res,
      error,
      statusCodes.serverError,
      'Error retrieving departments'
    );
  }
};
