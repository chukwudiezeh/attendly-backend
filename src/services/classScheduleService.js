const ClassSchedule = require('../models/ClassSchedule');
const ClassService = require('./classService');

class ClassScheduleService {
  async createClassSchedule(classScheduleData) {
    const classSchedule = new ClassSchedule(classScheduleData);
    const savedClassSchedule = await classSchedule.save();

    const classPayload = {
      curriculumCourse: savedClassSchedule.curriculumCourse,
      classSchedule: savedClassSchedule.id,
      day: savedClassSchedule.day,
      startTime: savedClassSchedule.startTime,
    };
    await ClassService.createClass(classPayload);
    return savedClassSchedule;
  }

  async getAllClassSchedules(query = {}) {
    return await ClassSchedule.find(query)
      .populate('curriculumCourse')
      .sort({ day: 1, startTime: 1 });
  }

  async getClassScheduleById(id) {
    const schedule = await ClassSchedule.findById(id)
      .populate('curriculumCourse');
    return schedule || {};
  }

  async updateClassSchedule(id, updateData) {
    return await ClassSchedule.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('curriculumCourse');
  }

  async deleteClassSchedule(id) {
    return await ClassSchedule.findByIdAndDelete(id);
  }

  async getClassSchedulesByCourse(courseId) {
    const schedules = await ClassSchedule.find({ curriculumCourse: courseId })
      .populate('curriculumCourse')
      .sort({ day: 1, startTime: 1 });
    return schedules.length ? schedules : [];
  }
}

module.exports = new ClassScheduleService();