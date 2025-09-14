const ClassSetting = require('../models/ClassSetting');
const classSchedule = require('../models/ClassSchedule');
const AppError = require('../utils/AppError');

class ClassSettingService {
  // Create class setting
  async createClassSetting(settingData) {
    try {
      // Check if setting already exists for this course
      const existingSetting = await ClassSetting.findOne({ 
        curriculumCourse: settingData.curriculumCourse 
      });

      if (existingSetting) {
        throw new AppError('Class setting already exists for this course', statusCodes.badRequest);
      }

      const classSetting = new ClassSetting(settingData);
      await classSetting.save();
      
      return await this.getClassSettingById(classSetting._id);
    } catch (error) {
      throw error;
    }
  }

  // Get class setting by ID
  async getClassSettingById(id) {
    const setting = await ClassSetting.findById(id)
      .populate('curriculumCourse', 'courseCode courseName creditUnits');
    
    if (!setting) {
      throw new AppError('Class setting not found', statusCodes.notFound);
    }
    
    return setting;
  }

  // Get class setting by course ID
  async getClassSettingByCourse(courseId) {
    const setting = await ClassSetting.findOne({ curriculumCourse: courseId })
      .populate('curriculumCourse', 'courseCode courseName creditUnits');
    
    if (!setting) {
      // Return default settings if none exist
      return {
        curriculumCourse: courseId,
        ...ClassSetting.getDefaultSettings(),
        isDefault: true
      };
    }
    
    return setting;
  }

  // Get all class settings
  // async getAllClassSettings(filters = {}) {
  //   const settings = await ClassSetting.find(filters)
  //     .populate('curriculumCourse', 'courseCode courseName creditUnits')
  //     .sort({ createdAt: -1 });
    
  //   return settings;
  // }

  // Update class setting
  async updateClassSetting(id, updateData) {
    const setting = await ClassSetting.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('curriculumCourse');

    if (!setting) {
      throw new AppError('Class setting not found', statusCodes.notFound);
    }

    return setting;
  }

  // Update class setting by course
  async updateClassSettingByCourse(courseId, updateData) {
    let setting = await ClassSetting.findOne({ curriculumCourse: courseId });

    if (!setting) {
      // Create new setting if none exists
      setting = new ClassSetting({
        curriculumCourse: courseId,
        ...updateData
      });
    } else {
      // Update existing setting
      Object.assign(setting, updateData);
      setting.updatedAt = new Date();
    }

    await setting.save();
    return await this.getClassSettingByCourse(courseId);
  }

  // Delete class setting
  async deleteClassSetting(id) {
    const setting = await ClassSetting.findByIdAndDelete(id);
    
    if (!setting) {
      throw new AppError('Class setting not found', statusCodes.notFound);
    }
    
    return setting;
  }

  // Reset to default settings
  async resetToDefault(courseId) {
    const defaultSettings = ClassSetting.getDefaultSettings();
    
    let setting = await ClassSetting.findOne({ curriculumCourse: courseId });
    
    if (!setting) {
      setting = new ClassSetting({
        curriculumCourse: courseId,
        ...defaultSettings
      });
    } else {
      Object.assign(setting, defaultSettings);
      setting.updatedAt = new Date();
    }

    await setting.save();
    return await this.getClassSettingByCourse(courseId);
  }
}

module.exports = new ClassSettingService();