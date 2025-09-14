const ClassService = require('../services/classService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class ClassController {
  /**
   * @desc    Create a class
   * @route   POST /api/classes
   * @access  Private
   */
  async createClass(req, res) {
    try {
      const classData = req.body;
      const newClass = await ClassService.createClass(classData);
      return successResponse(res, newClass, statusCodes.created, 'Class created successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error creating class');
    }
  }

  /**
   * @desc    Update a class
   * @route   PUT /api/classes/:id
   * @access  Private
   */
  async updateClass(req, res) {
    try {
      const classId = req.params.id;
      const updateData = req.body;
      const updatedClass = await ClassService.updateClass(classId, updateData);
      if (!updatedClass) {
        return errorResponse(res, null, statusCodes.notFound, 'Class not found');
      }
      return successResponse(res, updatedClass, statusCodes.ok, 'Class updated successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error updating class');
    }
  }

  /**
   * @desc    Get all classes by course
   * @route   GET /api/classes/course/:courseId
   * @access  Private
   */
  async getClassesByCourse(req, res) {
    try {
      const courseId = req.params.courseId;
      const classes = await ClassService.getClassesByCourse(courseId);
      return successResponse(res, classes, statusCodes.ok, 'Classes retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error retrieving classes');
    }
  }

  /**
   * @desc    Get a single class by ID
   * @route   GET /api/classes/:id
   * @access  Private
   */
  async getClass(req, res) {
    try {
      const classId = req.params.id;
      const classData = await ClassService.getClassById(classId);
      if (!classData) {
        return errorResponse(res, null, statusCodes.notFound, 'Class not found');
      }
      return successResponse(res, classData, statusCodes.ok, 'Class retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error retrieving class');
    }
  }
}

module.exports = new ClassController();