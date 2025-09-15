const Class = require('../models/Class');
const { getNextDayDate } = require('../utils/helper');

class ClassService {
  // Create a new class
  async createClass(classData) {
    //get the count of existing classes for the course to generate a unique name
    const classCount = await Class.countDocuments({ curriculumCourse: classData.curriculumCourse });
    const newClass = new Class({
      curriculumCourse: classData.curriculumCourse,
      classSchedule: classData.classSchedule,
      name: `Class ${classCount + 1}`,
      actualDate: getNextDayDate(classData.day, classData.startTime)
    });
    return await newClass.save();
  }

  // Update an existing class
  async updateClass(classId, updateData) {
    return await Class.findByIdAndUpdate(
      classId,
      updateData,
      { new: true }
    ).populate(['curriculumCourse', 'classSchedule']);
  }

  // Get all classes by course
  async getClassesByCourse(courseId) {
    return await Class.find({ curriculumCourse: courseId })
      .populate(['curriculumCourse', 'classSchedule'])
      .sort({ createdAt: -1 });
  }

  // Get a single class by ID
  async getClassById(classId) {
    return await Class.findById(classId)
      .populate(['curriculumCourse', 'classSchedule']);
  }
}

module.exports = new ClassService();