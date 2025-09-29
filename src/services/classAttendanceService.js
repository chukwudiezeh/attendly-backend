const ClassAttendance = require('../models/ClassAttendance');
const UserCourse = require('../models/UserCourse');
const Class = require('../models/Class');
const ClassSetting = require('../models/ClassSetting');
const AppError = require('../utils/AppError');
const { statusCodes } = require('../configs/constants');
const { getDistanceMeters } = require('../utils/helper');

class ClassAttendanceService {
  async attendanceClockIn(attendanceData, user) {
    //ensure user is regiestered to this class course
    const classDoc = await Class.findById(attendanceData.class).populate('curriculumCourse');
    if (!classDoc) throw new AppError('Class not found', statusCodes.badRequest);
    if (classDoc.status !== 'in_progress') throw new AppError('Cannot Clock-in! Class is not in progress.', statusCodes.badRequest);

    const userCourse = await UserCourse.findOne({
      user: user._id,
      curriculumCourse: classDoc.curriculumCourse._id
    });
    if (!userCourse) throw new AppError('User is not registered for this course', statusCodes.badRequest);

    // 2. Get class location and allowed radius
    const classSetting = await ClassSetting.findOne({ curriculumCourse: classDoc.curriculumCourse._id });
    const allowedRadius = classSetting ? classSetting.allowedRadius : 25;
    const classLocation = classDoc.geolocationData;

    // 3. Calculate distance
    const checkIn = attendanceData.checkInCoordinates;
    const distance = getDistanceMeters(
      classLocation.latitude, classLocation.longitude,
      checkIn.latitude, checkIn.longitude
    );
    if (distance > allowedRadius) throw new AppError('Check-in location is outside allowed radius', statusCodes.badRequest);

    // 4. Check if check-in time is within allowed window
    const windowMinutes = classSetting ? classSetting.attendanceWindow : 15;
    const classStart = new Date(classDoc.actualStartTime);
    const checkInTime = new Date(attendanceData.checkInTime || Date.now());
    const diffMinutes = Math.abs((checkInTime - classStart) / 60000);
    if (diffMinutes > windowMinutes) throw new AppError('Check-in time is outside allowed window', statusCodes.badRequest);

    // 5. Save attendance
    const attendance = new ClassAttendance({
      ...attendanceData,
      checkInTime,
      user: user._id
    });
    return await attendance.save();
  }

  async attendanceClockOut(attendanceData, user) {
    const attendance = await ClassAttendance.findOne({
      user: user._id,
      class: attendanceData.class
    });
    if (!attendance) throw new AppError('This user did not clock in for this class', statusCodes.notFound);

    // Get class and setting
    const classDoc = await Class.findById(attendanceData.class);
    if (!classDoc) throw new AppError('Class not found', statusCodes.badRequest);

    const classSetting = await ClassSetting.findOne({ curriculumCourse: classDoc.curriculumCourse });
    const allowedRadius = classSetting ? classSetting.allowedRadius : 25;
    const windowMinutes = classSetting ? classSetting.attendanceWindow : 15;

    // Ensure class status is completed
    if (classDoc.status !== 'completed') {
      throw new AppError('Cannot clock out! Class status must be completed', statusCodes.badRequest);
    }

    // Check if check-out time is within allowed window (from actualEndTime)
    const classEnd = new Date(classDoc.actualEndTime || Date.now());
    const checkOutTime = new Date(attendanceData.checkOutTime || Date.now());
    const diffMinutes = Math.abs((checkOutTime - classEnd) / 60000);
    if (diffMinutes > windowMinutes) {
      throw new AppError('Check-out time is outside allowed window', statusCodes.badRequest);
    }

    // Check if check-out coordinates are outside allowed radius
    const classLocation = classDoc.geolocationData;
    const checkOut = attendanceData.checkOutCoordinates;
    const distance = getDistanceMeters(
      classLocation.latitude, classLocation.longitude,
      checkOut.latitude, checkOut.longitude
    );

    if (distance > allowedRadius) {
      throw new AppError('Check-out location must be within allowed radius', statusCodes.badRequest);
    }

    // Update check-out details
    attendance.checkOutTime = checkOutTime;
    attendance.checkOutCoordinates = checkOut;
    attendance.status = 'present';

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

  async getAttendancesByClass(classId) {
    // For single populate with sub-path
    return await ClassAttendance.find({ class: classId })
      .populate([
        { path: 'user', select: 'name email matricNumber' },
        { 
          path: 'class',
          populate: { path: 'curriculumCourse', populate: { path: 'course' } }
        }
      ])
      .sort({ createdAt: -1 });
  }

  async getAttendancesByUser(userId) {
    return await ClassAttendance.find({ user: userId })
      .populate(['user', 'class'])
      .sort({ createdAt: -1 });
  }

  async getAttendanceByUserAndClass(userId, classId) {
    return await ClassAttendance.findOne({ user: userId, class: classId })
      .populate(['user', 'class'])
      .sort({ createdAt: -1 }) ;
  }

  async classAttendanceSummary(userId, userCourseId) {
    console.log('Generating attendance summary for user:', userId, 'and userCourse:', userCourseId);
    // Get all classes for this userCourse
    const userCourse = await UserCourse.findById(userCourseId);
    if (!userCourse) throw new Error('UserCourse not found');

    const classes = await Class.find({
      curriculumCourse: userCourse.curriculumCourse,
      academicYear: userCourse.academicYear,
      semester: userCourse.semester,
      level: userCourse.level,
      department: userCourse.department
    });

    const classIds = classes.map(cls => cls._id);

    // Get all attendances for this user and these classes
    const attendances = await ClassAttendance.find({
      user: userId,
      class: { $in: classIds }
    });

    // Compute stats
    const totalClasses = classes.length;
    let present = 0, absent = 0, late = 0, excused = 0;

    attendances.forEach(att => {
      if (att.status === 'present') present++;
      else if (att.status === 'absent') absent++;
      else if (att.status === 'late') late++;
      else if (att.status === 'excused') excused++;
    });

    return {
      totalClasses,
      present,
      absent,
      late,
      excused,
      forStudent: attendances.length // number of attendance records for the student
    };
  }
}

module.exports = new ClassAttendanceService();