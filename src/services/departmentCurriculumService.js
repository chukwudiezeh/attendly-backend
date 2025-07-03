const DepartmentCurriculum = require('../models/DepartmentCurriculum');
const Department = require('../models/Department');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const { statusCodes } = require('../configs/constants');

class DepartmentCurriculumService {

  /**
   * Get curriculum for a specific department
   */
  async getCurriculum(departmentId) {
    const curriculum = await DepartmentCurriculum.findOne({ department: departmentId })
      .populate('department')
      .populate('courses.course');

    if (!curriculum) {
      throw new AppError('Curriculum not found for this department', statusCodes.notFound);
    }

    return curriculum;
  }

  /**
   * Get courses for a specific level and semester in a department
   */
  async getLevelCourses(departmentId, level, semester) {
    const curriculum = await DepartmentCurriculum.findOne({ 
      department: departmentId,
      'courses.level': level,
      'courses.semester': semester
    }).populate('courses.course');

    if (!curriculum) {
      throw new AppError('Curriculum not found for this department', statusCodes.notFound);
    }

    return curriculum.courses.filter(
      course => course.level === parseInt(level) && course.semester === semester
    );
  }
}

module.exports = new DepartmentCurriculumService(); 