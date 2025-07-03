const Course = require('../models/Course');
const Department = require('../models/Department');
const User = require('../models/User');
const { userRoles, statusCodes } = require('../configs/constants');
const AppError = require('../utils/AppError');

class CourseService {
  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @param {string} lecturerId - ID of lecturer creating the course
   * @returns {Promise<Course>} Created course
   */
  async createCourse(courseData, lecturerId) {
    // Verify lecturer exists and is actually a lecturer
    const lecturer = await User.findOne({
      _id: lecturerId,
      role: userRoles.lecturer
    });

    if (!lecturer) {
      throw new AppError('Unauthorized! Only lecturers can create courses', statusCodes.unauthorized);
    }

    // Verify department exists
    const department = await Department.findById(courseData.department);
    if (!department) {
      throw new AppError('Department not found', statusCodes.notFound);
    }

    // Create course
    const course = new Course({
      ...courseData,
      lecturer: lecturerId,
      status: 'active' // Set default status
    });

    try {
      await course.save();
      return course.populate(['department', 'lecturer']);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError(
          'Course with this code or invite URL already exists',
          statusCodes.conflict
        );
      }
      throw new AppError('Error creating course', statusCodes.serverError);
    }
  }

  /**
   * Get all courses with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Course[]>} Array of courses
   */
  async getCourses(filters = {}) {
    const query = { ...filters };
    
    if (query.department) {
      const department = await Department.findById(query.department);
      if (!department) {
        throw new AppError('Department not found', statusCodes.notFound);
      }
    }

    const courses = await Course.find(query)
      .populate(['department', 'lecturer'])
      .sort({ code: 1 });

    return courses;
  }

  /**
   * Get course by ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Course>} Course object
   */
  async getCourseById(courseId) {
    const course = await Course.findById(courseId)
      .populate(['department', 'lecturer']);

    if (!course) {
      throw new AppError('Course not found', statusCodes.notFound);
    }

    return course;
  }

  /**
   * Get course by invite URL
   * @param {string} inviteUrl - Course invite URL
   * @returns {Promise<Course>} Course object
   */
  async getCourseByInviteUrl(inviteUrl) {
    const course = await Course.findOne({ inviteUrl })
      .populate(['department', 'lecturer']);

    if (!course) {
      throw new AppError('Invalid invite URL', statusCodes.notFound);
    }

    if (course.status !== 'active') {
      throw new AppError('This course is no longer active', statusCodes.badRequest);
    }

    return course;
  }

  /**
   * Update course
   * @param {string} courseId - Course ID
   * @param {Object} updateData - Data to update
   * @param {string} lecturerId - ID of lecturer updating the course
   * @returns {Promise<Course>} Updated course
   */
  async updateCourse(courseId, updateData, lecturerId) {
    // Find course and verify ownership
    const course = await Course.findOne({
      _id: courseId,
      lecturer: lecturerId
    });

    if (!course) {
      throw new AppError('Course not found or unauthorized', statusCodes.notFound);
    }

    // Update course
    Object.assign(course, updateData);
    
    try {
      await course.save();
      return course.populate(['department', 'lecturer']);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('Course with this invite URL already exists', statusCodes.conflict);
      }
      throw new AppError('Error updating course', statusCodes.serverError);
    }
  }

  /**
   * Delete course
   * @param {string} courseId - Course ID
   * @param {string} lecturerId - ID of lecturer deleting the course
   * @returns {Promise<void>}
   */
  async deleteCourse(courseId, lecturerId) {
    const course = await Course.findOne({
      _id: courseId,
      lecturer: lecturerId
    });

    if (!course) {
      throw new AppError('Course not found or unauthorized', statusCodes.notFound);
    }

    await course.deleteOne();
  }

  /**
   * Get courses by lecturer
   * @param {string} lecturerId - Lecturer ID
   * @returns {Promise<Course[]>} Array of courses
   */
  async getLecturerCourses(lecturerId) {
    const courses = await Course.find({ lecturer: lecturerId })
      .populate(['department', 'lecturer'])
      .sort({ code: 1 });

    return courses;
  }

  /**
   * Get courses by department
   * @param {string} departmentId - Department ID
   * @returns {Promise<Course[]>} Array of courses
   */
  async getDepartmentCourses(departmentId) {
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new AppError('Department not found', statusCodes.notFound);
    }

    const courses = await Course.find({ department: departmentId })
      .populate(['department', 'lecturer'])
      .sort({ code: 1 });

    return courses;
  }
}

module.exports = new CourseService(); 