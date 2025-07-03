const DepartmentCurriculum = require('../models/DepartmentCurriculum');
const Department = require('../models/Department');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const { statusCodes } = require('../configs/constants');

class DepartmentCurriculumService {
  /**
   * Create a new department curriculum
   */
  async createCurriculum(departmentId, courses) {
    // Validate department exists
    const departmentExists = await Department.findById(departmentId);
    if (!departmentExists) {
      throw new NotFoundError('Department not found');
    }

    // Validate all courses exist
    const courseIds = courses.map(course => course.course);
    const existingCourses = await Course.find({ _id: { $in: courseIds } });
    if (existingCourses.length !== courseIds.length) {
      throw new BadRequestError('One or more courses not found');
    }

    // Check if curriculum already exists for department
    const existingCurriculum = await DepartmentCurriculum.findOne({ department: departmentId });
    if (existingCurriculum) {
      throw new BadRequestError('Curriculum already exists for this department');
    }

    return DepartmentCurriculum.create({
      department: departmentId,
      courses: courses.map(course => ({
        course: course.course,
        level: course.level,
        semester: course.semester,
        courseType: course.courseType,
        creditUnits: course.creditUnits
      }))
    });
  }

  /**
   * Get all department curricula
   */
  async getAllCurricula() {
    return DepartmentCurriculum.find()
      .populate('department')
      .populate('courses.course');
  }

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
    let query = { department: departmentId };
    if (level) {
      query['courses.level'] = level;
    }
    if (semester) {
      query['courses.semester'] = semester;
    }
    const curriculum = await DepartmentCurriculum.findOne(query).populate('courses.course');

    if (!curriculum) {
      throw new AppError('Curriculum not found for this department', statusCodes.notFound);
    }

    return curriculum.courses.filter(
      course => course.level === parseInt(level) && course.semester === semester
    );
  }

  /**
   * Update department curriculum
   */
  async updateCurriculum(departmentId, courses) {
    // Validate all courses exist
    if (courses) {
      const courseIds = courses.map(course => course.course);
      const existingCourses = await Course.find({ _id: { $in: courseIds } });
      if (existingCourses.length !== courseIds.length) {
        throw new BadRequestError('One or more courses not found');
      }
    }

    const curriculum = await DepartmentCurriculum.findOneAndUpdate(
      { department: departmentId },
      { 
        $set: { 
          courses: courses.map(course => ({
            course: course.course,
            level: course.level,
            semester: course.semester,
            courseType: course.courseType,
            creditUnits: course.creditUnits
          }))
        }
      },
      { new: true, runValidators: true }
    ).populate('department courses.course');

    if (!curriculum) {
      throw new NotFoundError('Curriculum not found for this department');
    }

    return curriculum;
  }

  /**
   * Add courses to department curriculum
   */
  async addCourses(departmentId, courses) {
    // Validate all courses exist
    const courseIds = courses.map(course => course.course);
    const existingCourses = await Course.find({ _id: { $in: courseIds } });
    if (existingCourses.length !== courseIds.length) {
      throw new BadRequestError('One or more courses not found');
    }

    const curriculum = await DepartmentCurriculum.findOneAndUpdate(
      { department: departmentId },
      { 
        $push: { 
          courses: {
            $each: courses.map(course => ({
              course: course.course,
              level: course.level,
              semester: course.semester,
              courseType: course.courseType,
              creditUnits: course.creditUnits
            }))
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('department courses.course');

    if (!curriculum) {
      throw new NotFoundError('Curriculum not found for this department');
    }

    return curriculum;
  }

  /**
   * Remove courses from department curriculum
   */
  async removeCourses(departmentId, courseIds) {
    const curriculum = await DepartmentCurriculum.findOneAndUpdate(
      { department: departmentId },
      { $pull: { courses: { course: { $in: courseIds } } } },
      { new: true }
    ).populate('department courses.course');

    if (!curriculum) {
      throw new NotFoundError('Curriculum not found for this department');
    }

    return curriculum;
  }

  /**
   * Delete department curriculum
   */
  async deleteCurriculum(departmentId) {
    const curriculum = await DepartmentCurriculum.findOneAndDelete({ department: departmentId });

    if (!curriculum) {
      throw new NotFoundError('Curriculum not found for this department');
    }

    return curriculum;
  }

  /**
   * Get course statistics for a department
   */
  async getCurriculumStats(departmentId) {
    const curriculum = await DepartmentCurriculum.findOne({ department: departmentId })
      .populate('courses.course');

    if (!curriculum) {
      throw new NotFoundError('Curriculum not found for this department');
    }

    const stats = {
      totalCourses: curriculum.courses.length,
      coursesByLevel: {},
      coursesByType: {
        core: 0,
        elective: 0,
        general: 0
      },
      totalCreditUnits: 0
    };

    curriculum.courses.forEach(course => {
      // Count by level
      stats.coursesByLevel[course.level] = (stats.coursesByLevel[course.level] || 0) + 1;
      
      // Count by type
      stats.coursesByType[course.courseType]++;
      
      // Sum credit units
      stats.totalCreditUnits += course.creditUnits;
    });

    return stats;
  }
}

module.exports = new DepartmentCurriculumService(); 