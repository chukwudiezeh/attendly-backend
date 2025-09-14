const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

// Create a class
router.post('/', ClassController.createClass);

// Update a class
router.put('/:id', ClassController.updateClass);

// Delete a class
// router.delete('/:id', ClassController.deleteClass);

// Get a single class
router.get('/:id', ClassController.getClass);

// Get all classes by course
router.get('/curriculum-course/:courseId', ClassController.getClassesByCourse);

// Get all classes
// router.get('/', ClassController.getAllClasses);

module.exports = router;