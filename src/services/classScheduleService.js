const ClassSchedule = require('../models/ClassSchedule');

class ClassScheduleService {
  async createClassSchedule(classScheduleData) {
    const classSchedule = new ClassSchedule(classScheduleData);
    return await classSchedule.save();
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