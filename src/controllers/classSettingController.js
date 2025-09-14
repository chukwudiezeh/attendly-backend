const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');
const classSettingService = require('../services/classSettingService');

class ClassSettingController {
  /**
   * @desc    Create a new class setting
   * @route   POST /api/class-settings
   * @access  Private
   */
  async createClassSetting(req, res) {
    try {
      const classSetting = await classSettingService.createClassSetting(req.body);
      return successResponse(res, classSetting, statusCodes.created, 'Class setting created successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Get class setting by ID
   * @route   GET /api/class-settings/:id
   * @access  Private
   */
  async getClassSettingById(req, res) {
    try {
      const classSetting = await classSettingService.getClassSettingById(req.params.id);
      return successResponse(res, classSetting, statusCodes.ok, 'Class setting retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Get class setting by course ID
   * @route   GET /api/class-settings/curriculum-course/:courseId
   * @access  Private
   */
  async getClassSettingByCourse(req, res) {
    try {
      const classSetting = await classSettingService.getClassSettingByCourse(req.params.courseId);
      return successResponse(res, classSetting, statusCodes.ok, 'Class setting retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Get all class settings
   * @route   GET /api/class-settings
   * @access  Private
   */
  async getAllClassSettings(req, res) {
    try {
      const classSettings = await classSettingService.getAllClassSettings(req.query);
      return successResponse(res, classSettings, statusCodes.ok, 'Class settings retrieved successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Update class setting
   * @route   PUT /api/class-settings/:id
   * @access  Private
   */
  async updateClassSetting(req, res) {
    try {
      const classSetting = await classSettingService.updateClassSetting(req.params.id, req.body);
      return successResponse(res, classSetting, statusCodes.ok, 'Class setting updated successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Update class setting by course
   * @route   PUT /api/class-settings/course/:courseId
   * @access  Private
   */
  async updateClassSettingByCourse(req, res) {
    try {
      const classSetting = await classSettingService.updateClassSettingByCourse(req.params.courseId, req.body);
      return successResponse(res, classSetting, statusCodes.ok, 'Class setting updated successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Delete class setting
   * @route   DELETE /api/class-settings/:id
   * @access  Private
   */
  async deleteClassSetting(req, res) {
    try {
      await classSettingService.deleteClassSetting(req.params.id);
      return successResponse(res, null, statusCodes.ok, 'Class setting deleted successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }

  /**
   * @desc    Reset class setting to default
   * @route   POST /api/class-settings/course/:courseId/reset
   * @access  Private
   */
  async resetToDefault(req, res) {
    try {
      const classSetting = await classSettingService.resetToDefault(req.params.courseId);
      return successResponse(res, classSetting, statusCodes.ok, 'Class setting reset to default successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, error.message);
    }
  }
}

module.exports = new ClassSettingController(); 