const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/tokenValidator');
const classAttendanceController = require('../controllers/classAttendanceController');
const { validateCreateClassAttendance, validateUpdateClassAttendance } = require('../middlewares/validators/classAttendanceValidator');

// Create a new class attendance
// router.post('/', validateToken, validateCreateClassAttendance, classAttendanceController.createClassAttendance);

// Get all class attendances
// router.get('/', classAttendanceController.getAllClassAttendances);

// Get attendances by class
router.get('/class/:classId', validateToken, classAttendanceController.getAttendancesByClass);

// Get attendances by user
router.get('/user/:userId', validateToken, classAttendanceController.getAttendancesByUser);

// Get attendance by user and class
router.get('/user/:userId/class/:classId', validateToken, classAttendanceController.getAttendanceByUserAndClass);

// Get a specific class attendance
router.get('/:id', validateToken, classAttendanceController.getClassAttendanceById);


// Clock-in attendance
router.post('/clockin', validateCreateClassAttendance, classAttendanceController.attendanceClockIn);

// Clock-out attendance
router.post('/clockout', validateUpdateClassAttendance, classAttendanceController.attendanceClockOut);

// Attendance summary for a user and userCourse
router.get('/summary/user/:userId/usercourse/:userCourseId', validateToken, classAttendanceController.classAttendanceSummary);

module.exports = router;