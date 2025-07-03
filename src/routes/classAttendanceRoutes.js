const express = require('express');
const router = express.Router();
const classAttendanceController = require('../controllers/classAttendanceController');
const { validateCreateClassAttendance, validateUpdateClassAttendance } = require('../middlewares/validators/classAttendanceValidator');

// Create a new class attendance
router.post('/', validateCreateClassAttendance, classAttendanceController.createClassAttendance);

// Get all class attendances
router.get('/', classAttendanceController.getAllClassAttendances);

// Get attendances by class
router.get('/class/:classId', classAttendanceController.getAttendancesByClass);

// Get attendances by user
router.get('/user/:userId', classAttendanceController.getAttendancesByUser);

// Get attendance by user and class
router.get('/user/:userId/class/:classId', classAttendanceController.getAttendanceByUserAndClass);

// Get a specific class attendance
router.get('/:id', classAttendanceController.getClassAttendanceById);

// Update a class attendance
router.put('/:id', validateUpdateClassAttendance, classAttendanceController.updateClassAttendance);

// Update attendance status
router.patch('/:id/status', validateUpdateClassAttendance, classAttendanceController.updateAttendanceStatus);

// Delete a class attendance
router.delete('/:id', classAttendanceController.deleteClassAttendance);

module.exports = router; 