const departmentCurriculumService = require('../services/departmentCurriculumService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class DepartmentCurriculumController {
  
  /**
   * Get curriculum for a specific department - regardless of the level and semester
   * @route GET /api/department-curricula/:departmentId
   */
  async getDepartmentCurriculum(req, res) {
    try {
      const { departmentId } = req.params;
      const curriculum = await departmentCurriculumService.getCurriculum(departmentId);
      
      return successResponse(res, curriculum, statusCodes.ok, 'Curriculum retrieved successfully');
    } catch (error) {
      return errorResponse(res, null, error.statusCode || 500, error.message || 'Internal server error');
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
}

module.exports = new DepartmentCurriculumController(); 