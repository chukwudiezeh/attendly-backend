const UserCourse = require('../models/UserCourse');
const mongoose = require('mongoose');
const { statusCodes, userRoles } = require('../configs/constants');
const AppError = require('../utils/AppError');
const DepartmentCurriculum = require('../models/DepartmentCurriculum');

class UserCourseService {
  /**
 * Register courses for a user
 * @param {Object} data - The course registration data
 * @param {string} data.user - User ID
 * @param {string} data.academicYear - Academic year ID
 * @param {string} data.department - Department ID
 * @param {number} data.level - Student level
 * @param {string} data.semester - Semester (first/second)
 * @param {Array} data.courses - Array of courses to register
 * @returns {Promise<Array>} Array of registered courses
 */
  async registerCourses(bigData) {
    const { user, data } = bigData;
    const { academicYear, department, level, semester, curriculumCourses, curriculumCourseRole } = data;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userCourses = [];

        if (user.role == userRoles.student) {

          for (const curriculumCourse of curriculumCourses) {
              const existingCourse = await UserCourse.findOne({
                  user: user._id,
                  academicYear,
                  department,
                  level,
                  semester,
                  curriculumCourse,
                  curriculumCourseRole
              }).populate('curriculumCourse.course', 'code').session(session);

              if (existingCourse) {
                  throw new AppError(`${existingCourse.curriculumCourse.course.code} already registered for this semester`, statusCodes.badRequest);
              }

              userCourses.push({
                  user: user._id,
                  academicYear,
                  department,
                  level,
                  semester,
                  curriculumCourse,
                  curriculumCourseRole
              });
          }
        } else if (user.role == userRoles.lecturer) {
          for (const curriculumCourse of curriculumCourses) {
            //fetch curriculum Cpurse
            const curriculumCourseDoc = await DepartmentCurriculum.findById(curriculumCourse).session(session);
            if (!curriculumCourseDoc) {
              throw new AppError('Invalid curriculum course ID', statusCodes.badRequest);
            }
            //check for existing source registration
            const existingCourse = await UserCourse.findOne({
              user: user._id,
              academicYear,
              department: curriculumCourseDoc.department,
              level: curriculumCourseDoc.level,
              semester: curriculumCourseDoc.semester,
              curriculumCourse,
              curriculumCourseRole
            }).populate('curriculumCourse.course', 'code').session(session);
            //throw error if exists
            if (existingCourse) {
              throw new AppError(`${existingCourse.curriculumCourse.course.code} already registered for this semester`, statusCodes.badRequest);
            }
            //format new db payload
            userCourses.push({
              user: user._id,
              academicYear,
              department: curriculumCourseDoc.department,
              level: curriculumCourseDoc.level,
              semester: curriculumCourseDoc.semester,
              curriculumCourse,
              curriculumCourseRole
            });
          }
        } else {
          throw new AppError('Only students and lecturers can register courses', statusCodes.forbidden);
        }

        const registeredCourses = await UserCourse.insertMany(userCourses, { session });

        await session.commitTransaction();
        return registeredCourses;

    } catch (error) {
        await session.abortTransaction();
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to register courses', statusCodes.internalServerError);
    } finally {
        session.endSession();
    }
}

    /**
 * Get user courses for a specific semester
 * @param {string} userId - User ID
 * @param {string} academicYearId - Academic year ID
 * @param {string} semester - Semester (first/second)
 * @returns {Promise<Array>} Array of user courses
 */
  async getUserCourses(bigData) {

    const {user, data } = bigData;
    const {academicYear, department, level, semester } = data;
    const query = {
        user: user._id
    }
    if (department) query.department = department;
    if (academicYear) query.academicYear = academicYear;
    if (level) query.level = level;
    if (semester) query.semester = semester;

    const userCourses = await UserCourse.find(query)
      .sort({ createdAt: -1 })
      .populate([
        { path: 'academicYear' },
        { path: 'department' },
        { path: 'curriculumCourse', select: 'course level semester courseType creditUnits', populate: { path: 'course', select: 'code name' } }
      ]);
    console.log('Fetched user courses:', userCourses);
    return userCourses
  }

  // Get single user course
  async getUserCourseById(id) {
    return await UserCourse.findById(id)
      .populate('user', 'firstName lastName email role')
      .populate('academicYear', 'year startDate endDate')
      .populate('department', 'name code')
      .populate('curriculumCourse', 'courseCode courseName creditUnits');
  }

  // Update user course status
  async updateUserCourseStatus(id, status) {
    return await UserCourse.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  // Get courses by curriculum course ID
  async getCourseParticipants(curriculumCourseId, academicYear, semester) {
    return await UserCourse.find({
      curriculumCourse: curriculumCourseId,
      academicYear,
      semester
    })
    .populate('user', 'firstName lastName email role')
    .sort({ curriculumCourseRole: 1, createdAt: 1 });
  }

  // Remove user from course
  async removeUserCourse(id) {
    return await UserCourse.findByIdAndDelete(id);
  }

  // Get user's courses for a specific semester
  async getUserSemesterCourses(userId, academicYear, semester) {
    return await UserCourse.find({
      user: userId,
      academicYear,
      semester
    })
    .populate('curriculumCourse', 'courseCode courseName creditUnits')
    .sort({ createdAt: 1 });
  }

  async getAllUserCourses(user) {
    let userCourses;
    if (user.role == userRoles.student) {
      userCourses = await UserCourse.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: {
              academicYear: '$academicYear',
              level: '$level',
              semester: '$semester'
            }
          }
        },
        {
          $lookup: {
            from: 'academicyears', // collection name in MongoDB (usually lowercase plural)
            localField: '_id.academicYear',
            foreignField: '_id',
            as: 'academicYear'
          }
        },
        {
          $unwind: '$academicYear'
        },
        {
          $project: {
            academicYear: 1,
            level: '$_id.level',
            semester: '$_id.semester',
            _id: 0
          }
        }
      ]);
    } else if (user.role == userRoles.lecturer) {
      userCourses = await UserCourse.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: {
            academicYear: '$academicYear',
            semester: '$semester'
          }
        }
      },
      {
        $lookup: {
          from: 'academicyears', // collection name in MongoDB (usually lowercase plural)
          localField: '_id.academicYear',
          foreignField: '_id',
          as: 'academicYear'
        }
      },
      {
        $unwind: '$academicYear'
      },
      {
        $project: {
          academicYear: 1,
          semester: '$_id.semester',
          _id: 0
        }
      }
    ]);
    } else {
      throw new AppError('Only students and lecturers can access their courses', statusCodes.forbidden);
    }

    return userCourses;
  }
}

module.exports = new UserCourseService();