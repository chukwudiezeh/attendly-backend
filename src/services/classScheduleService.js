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
    return await ClassSchedule.findById(id)
      .populate('curriculumCourse');
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
    return await ClassSchedule.find({ curriculumCourse: courseId })
      .populate('curriculumCourse')
      .sort({ day: 1, startTime: 1 });
  }
}

module.exports = new ClassScheduleService(); 