const ClassAttendance = require('../models/ClassAttendance');

class ClassAttendanceService {
  async createClassAttendance(attendanceData) {
    const attendance = new ClassAttendance(attendanceData);
    return await attendance.save();
  }

  async getAllClassAttendances(query = {}) {
    return await ClassAttendance.find(query)
      .populate('user', 'name email')
      .populate('class')
      .sort({ createdAt: -1 });
  }

  async getClassAttendanceById(id) {
    return await ClassAttendance.findById(id)
      .populate('user', 'name email')
      .populate('class');
  }

  async updateClassAttendance(id, updateData) {
    return await ClassAttendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('class');
  }

  async deleteClassAttendance(id) {
    return await ClassAttendance.findByIdAndDelete(id);
  }

  async getAttendancesByClass(classId) {
    return await ClassAttendance.find({ class: classId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  }

  async getAttendancesByUser(userId) {
    return await ClassAttendance.find({ user: userId })
      .populate('class')
      .sort({ createdAt: -1 });
  }

  async getAttendanceByUserAndClass(userId, classId) {
    return await ClassAttendance.findOne({ user: userId, class: classId })
      .populate('user', 'name email')
      .populate('class');
  }

  async updateAttendanceStatus(id, status) {
    return await ClassAttendance.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email')
     .populate('class');
  }
}

module.exports = new ClassAttendanceService(); 