const departmentCurriculumService = require('../services/departmentCurriculumService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const Department = require('../models/Department');
const Course = require('../models/Course');

class DepartmentCurriculumController {
  /**
   * Create a new department curriculum
   * @route POST /api/department-curricula
   */
  async createDepartmentCurriculum(req, res) {
    try {
      const { department, courses } = req.body;
      const curriculum = await departmentCurriculumService.createCurriculum(department, courses);
      
      return successResponse(res, 201, 'Curriculum created successfully', curriculum);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Get all department curricula
   * @route GET /api/department-curricula
   */
  async getAllDepartmentCurricula(req, res) {
    try {
      const curricula = await departmentCurriculumService.getAllCurricula();
      
      return successResponse(res, 200, 'Curricula retrieved successfully', curricula, curricula.length);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Get curriculum for a specific department
   * @route GET /api/department-curricula/:departmentId
   */
  async getDepartmentCurriculum(req, res) {
    try {
      const { departmentId } = req.params;
      const curriculum = await departmentCurriculumService.getCurriculum(departmentId);
      
      return successResponse(res, 200, 'Curriculum retrieved successfully', curriculum);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Get courses for a specific level and semester in a department
   * @route GET /api/department-curricula/:departmentId/courses
   */
  async getDepartmentLevelCourses(req, res) {
    try {
      const { departmentId } = req.params;
      const { level, semester } = req.query;
      
      const levelCourses = await departmentCurriculumService.getLevelCourses(departmentId, level, semester);
      
      return successResponse(res, levelCourses, statusCodes.ok, 'Level courses retrieved successfully');
    } catch (error) {
      return errorResponse(res, null, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Update department curriculum
   * @route PUT /api/department-curricula/:departmentId
   */
  async updateDepartmentCurriculum(req, res) {
    try {
      const { departmentId } = req.params;
      const { courses } = req.body;
      
      const curriculum = await departmentCurriculumService.updateCurriculum(departmentId, courses);
      
      return successResponse(res, 200, 'Curriculum updated successfully', curriculum);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Add courses to department curriculum
   * @route POST /api/department-curricula/:departmentId/courses
   */
  async addCourses(req, res) {
    try {
      const { departmentId } = req.params;
      const { courses } = req.body;
      
      const curriculum = await departmentCurriculumService.addCourses(departmentId, courses);
      
      return successResponse(res, 200, 'Courses added successfully', curriculum);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Remove courses from department curriculum
   * @route DELETE /api/department-curricula/:departmentId/courses
   */
  async removeCourses(req, res) {
    try {
      const { departmentId } = req.params;
      const { courseIds } = req.body;
      
      const curriculum = await departmentCurriculumService.removeCourses(departmentId, courseIds);
      
      return successResponse(res, 200, 'Courses removed successfully', curriculum);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Delete department curriculum
   * @route DELETE /api/department-curricula/:departmentId
   */
  async deleteDepartmentCurriculum(req, res) {
    try {
      const { departmentId } = req.params;
      
      await departmentCurriculumService.deleteCurriculum(departmentId);
      
      return successResponse(res, 200, 'Curriculum deleted successfully');
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }

  /**
   * Get course statistics for a department
   * @route GET /api/department-curricula/:departmentId/stats
   */
  async getDepartmentCurriculumStats(req, res) {
    try {
      const { departmentId } = req.params;
      
      const stats = await departmentCurriculumService.getCurriculumStats(departmentId);
      
      return successResponse(res, 200, 'Curriculum statistics retrieved successfully', stats);
    } catch (error) {
      return errorResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
  }
}

module.exports = new DepartmentCurriculumController(); 