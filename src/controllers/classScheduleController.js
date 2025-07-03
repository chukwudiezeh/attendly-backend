const classScheduleService = require('../services/classScheduleService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class ClassScheduleController {
  async createClassSchedule(req, res) {
    try {
      const classSchedule = await classScheduleService.createClassSchedule(req.body);
      return successResponse(res, classSchedule, statusCodes.created, 'Class schedule created successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getAllClassSchedules(req, res) {
    try {
      const classSchedules = await classScheduleService.getAllClassSchedules(req.query);
      return successResponse(res, classSchedules);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getClassScheduleById(req, res) {
    try {
      const classSchedule = await classScheduleService.getClassScheduleById(req.params.id);
      if (!classSchedule) {
        return errorResponse(res, 'Class schedule not found', statusCodes.notFound);
      }
      return successResponse(res, classSchedule);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async updateClassSchedule(req, res) {
    try {
      const classSchedule = await classScheduleService.updateClassSchedule(req.params.id, req.body);
      if (!classSchedule) {
        return errorResponse(res, 'Class schedule not found', statusCodes.notFound);
      }
      return successResponse(res, classSchedule, statusCodes.ok, 'Class schedule updated successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async deleteClassSchedule(req, res) {
    try {
      const classSchedule = await classScheduleService.deleteClassSchedule(req.params.id);
      if (!classSchedule) {
        return errorResponse(res, 'Class schedule not found', statusCodes.notFound);
      }
      return successResponse(res, null, statusCodes.ok, 'Class schedule deleted successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getClassSchedulesByCourse(req, res) {
    try {
      const classSchedules = await classScheduleService.getClassSchedulesByCourse(req.params.courseId);
      return successResponse(res, classSchedules);
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}

module.exports = new ClassScheduleController(); 