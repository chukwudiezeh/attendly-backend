const express = require('express');
const router = express.Router();
const classScheduleController = require('../controllers/classScheduleController');
const { validateCreateClassSchedule, validateUpdateClassSchedule } = require('../middlewares/validators/classScheduleValidator');

// Create a new class schedule
router.post('/', validateCreateClassSchedule, classScheduleController.createClassSchedule);

// Get all class schedules
router.get('/', classScheduleController.getAllClassSchedules);

// Get class schedules by course
router.get('/curriculum-course/:courseId', classScheduleController.getClassSchedulesByCourse);

// Get a specific class schedule
router.get('/:id', classScheduleController.getClassScheduleById);

// Update a class schedule
router.put('/:id', validateUpdateClassSchedule, classScheduleController.updateClassSchedule);

// Delete a class schedule
router.delete('/:id', classScheduleController.deleteClassSchedule);

module.exports = router; 