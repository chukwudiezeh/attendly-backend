const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');
const userCourseService = require('../services/userCourseService');

class UserCourseController {

    /**
 * @desc    Register courses for a user
 * @route   POST /api/user-courses/register
 * @access  Private
 */
  async registerCourses(req, res) {
    try {
      const user = req.user;
      const registeredCourses = await userCourseService.registerCourses({user, data: req.body});

      return successResponse(res, registeredCourses, statusCodes.created, 'Courses registered successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error registering courses');
    }
  }
/**
 * @desc    Get user courses for a semester
 * @route   GET /api/user-courses
 * @access  Private
 */
  async getUserCourses(req, res) {
    try {
      const courses = await userCourseService.getUserCourses(req.query);

      return successResponse(res, courses, statusCodes.ok, 'User courses retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error retrieving user courses');
    }
  }

  async getAllUserCourses(req, res) {
    try {
      console.log(req.user);
      const courses = await userCourseService.getAllUserCourses(req.user);
      console.log(courses);
      return successResponse(res, courses, statusCodes.ok, 'All user courses retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error retrieving all user courses');
    }
  }
}

module.exports = new UserCourseController(); 