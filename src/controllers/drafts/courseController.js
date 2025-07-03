const courseService = require('../../services/courseService');
const { successResponse, errorResponse } = require('../../utils/responseFormatter');
const { statusCodes } = require('../../configs/constants');

class CourseController {
  async createCourse(req, res) {
    try {
      const result = await courseService.createCourse(req.body, req.user._id);
      return successResponse(res, result, statusCodes.created, 'Course created successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async getCourses(req, res) {
    try {
      const filters = req.query;
      const result = await courseService.getCourses(filters);
      return successResponse(res, result, statusCodes.ok, 'Courses retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async getCourseById(req, res) {
    try {
      const result = await courseService.getCourseById(req.params.id);
      return successResponse(res, result, statusCodes.ok, 'Course retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async getCourseByInviteUrl(req, res) {
    try {
      const result = await courseService.getCourseByInviteUrl(req.params.inviteUrl);
      return successResponse(res, result, statusCodes.ok, 'Course retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async updateCourse(req, res) {
    try {
      const result = await courseService.updateCourse(req.params.id, req.body, req.user._id);
      return successResponse(res, result, statusCodes.ok, 'Course updated successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async deleteCourse(req, res) {
    try {
      await courseService.deleteCourse(req.params.id, req.user._id);
      return successResponse(res, null, statusCodes.ok, 'Course deleted successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async getLecturerCourses(req, res) {
    try {
      const result = await courseService.getLecturerCourses(req.user._id);
      return successResponse(res, result, statusCodes.ok, 'Courses retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }

  async getDepartmentCourses(req, res) {
    try {
      const result = await courseService.getDepartmentCourses(req.params.departmentId);
      return successResponse(res, result, statusCodes.ok, 'Courses retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, error.statusCode || statusCodes.serverError, error.message);
    }
  }
}

module.exports = new CourseController(); 