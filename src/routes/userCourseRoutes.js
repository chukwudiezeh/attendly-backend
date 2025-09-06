const express = require('express');
const router = express.Router();

const { validateToken } = require('../middlewares/tokenValidator');
const {
  validateRegisterCourses,
  validateGetUserCourses
} = require('../middlewares/validators/userCourseValidator');
const userCourseController = require('../controllers/userCourseController');

// Register courses
router.post('/register', validateToken, validateRegisterCourses, userCourseController.registerCourses);

// Get user courses
router.get('/', validateToken, userCourseController.getUserCourses);
router.get('/all', validateToken, userCourseController.getAllUserCourses);

module.exports = router; 