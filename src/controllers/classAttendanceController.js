const classAttendanceService = require('../services/classAttendanceService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class ClassAttendanceController {
  async createClassAttendance(req, res) {
    try {
      const attendance = await classAttendanceService.createClassAttendance(req.body);
      return successResponse(res, attendance, statusCodes.created, 'Class attendance created successfully');
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, 'Attendance record already exists for this user and class', statusCodes.conflict);
      }
      return errorResponse(res, error);
    }
  }

  async getAllClassAttendances(req, res) {
    try {
      const attendances = await classAttendanceService.getAllClassAttendances(req.query);
      return successResponse(res, attendances);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getClassAttendanceById(req, res) {
    try {
      const attendance = await classAttendanceService.getClassAttendanceById(req.params.id);
      if (!attendance) {
        return errorResponse(res, 'Class attendance not found', statusCodes.notFound);
      }
      return successResponse(res, attendance);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async updateClassAttendance(req, res) {
    try {
      const attendance = await classAttendanceService.updateClassAttendance(req.params.id, req.body);
      if (!attendance) {
        return errorResponse(res, 'Class attendance not found', statusCodes.notFound);
      }
      return successResponse(res, attendance, statusCodes.ok, 'Class attendance updated successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async deleteClassAttendance(req, res) {
    try {
      const attendance = await classAttendanceService.deleteClassAttendance(req.params.id);
      if (!attendance) {
        return errorResponse(res, 'Class attendance not found', statusCodes.notFound);
      }
      return successResponse(res, null, statusCodes.ok, 'Class attendance deleted successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getAttendancesByClass(req, res) {
    try {
      const attendances = await classAttendanceService.getAttendancesByClass(req.params.classId);
      return successResponse(res, attendances);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getAttendancesByUser(req, res) {
    try {
      const attendances = await classAttendanceService.getAttendancesByUser(req.params.userId);
      return successResponse(res, attendances);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async getAttendanceByUserAndClass(req, res) {
    try {
      const attendance = await classAttendanceService.getAttendanceByUserAndClass(
        req.params.userId,
        req.params.classId
      );
      if (!attendance) {
        return errorResponse(res, 'Class attendance not found', statusCodes.notFound);
      }
      return successResponse(res, attendance);
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async updateAttendanceStatus(req, res) {
    try {
      const attendance = await classAttendanceService.updateAttendanceStatus(
        req.params.id,
        req.body.status
      );
      if (!attendance) {
        return errorResponse(res, 'Class attendance not found', statusCodes.notFound);
      }
      return successResponse(res, attendance, statusCodes.ok, 'Attendance status updated successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}

module.exports = new ClassAttendanceController(); 