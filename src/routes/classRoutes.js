const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');
const { validateToken } = require('../middlewares/tokenValidator');

// Create a class
router.post('/', validateToken, ClassController.createClass);

// Update a class
router.put('/:id', validateToken, ClassController.updateClass);

// Delete a class
// router.delete('/:id', ClassController.deleteClass);

// Get a single class
router.get('/:id', validateToken, ClassController.getClass);

// Get all classes by course
router.get('/curriculum-course/:courseId', validateToken, ClassController.getClassesByCourse);

// Get all classes
// router.get('/', ClassController.getAllClasses);

module.exports = router;