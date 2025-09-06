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
  async getLevelCourses(department, academicYear, level, semester) {
    const curricula = await DepartmentCurriculum.find({
      department,
      academicYear,
      level,
      semester
    }).populate('course');

    if (!curricula.length) {
      throw new AppError('Curriculum not found for this department', statusCodes.notFound);
    }

    return curricula;
  }
}

module.exports = new DepartmentCurriculumService(); 