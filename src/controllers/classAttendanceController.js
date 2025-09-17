const classAttendanceService = require('../services/classAttendanceService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class ClassAttendanceController {
  async attendanceClockIn(req, res) {
    try {
      const user = req.user;

      const clockInResponse = await classAttendanceService.attendanceClockIn(req.body, user);
      return successResponse(res, clockInResponse, statusCodes.created, 'Class attendance created successfully');
    } catch (error) {
      if (error.code === 11000) {
        return errorResponse(res, 'Attendance record already exists for this user and class', statusCodes.conflict);
      }
      return errorResponse(res, error);
    }
  }

  async attendanceClockOut(req, res) {
    try {
      const user = req.user;

      const clockOutResponse = await classAttendanceService.attendanceClockOut(req.body, user);
      return successResponse(res, clockOutResponse, statusCodes.ok, 'Class attendance updated successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  async classAttendanceSummary (req, res) {
    try {
      const user = req.user;
      const summary = await classAttendanceService.classAttendanceSummary(user._id, req.query);
      return successResponse(res, summary, statusCodes.ok, 'Class attendance summary retrieved successfully');
    } catch (error) {
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

  //for lecturer
  async getAttendancesByClass(req, res) {
    try {
      const attendances = await classAttendanceService.getAttendancesByClass(req.params.classId);
      return successResponse(res, attendances, statusCodes.ok, 'Attendances retrieved successfully');
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

  //for student
  async getAttendanceByUserAndClass(req, res) {
    try {
      const attendance = await classAttendanceService.getAttendanceByUserAndClass(
        req.params.userId,
        req.params.classId
      );
      if (!attendance) {
        return errorResponse(res, 'Class attendance not found', statusCodes.notFound, 'No attendance record found for this user and class');
      }
      return successResponse(res, attendance, statusCodes.ok, 'Attendance retrieved successfully');
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}

module.exports = new ClassAttendanceController(); 