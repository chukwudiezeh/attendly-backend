const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { validateToken } = require('../middlewares/tokenValidator');
const { validateCreateCourse, validateUpdateCourse } = require('../middlewares/validators/courseValidator');
const { checkRole } = require('../middlewares/roleValidator');
const { userRoles } = require('../configs/constants');

// Protected routes - require authentication
router.use(validateToken);

// Course routes
router.post(
  '/',
  checkRole([userRoles.lecturer]),
  validateCreateCourse,
  courseController.createCourse
);

router.get('/', courseController.getCourses);
router.get('/lecturer', courseController.getLecturerCourses);
router.get('/department/:departmentId', courseController.getDepartmentCourses);
router.get('/join/:inviteUrl', courseController.getCourseByInviteUrl);
router.get('/:id', courseController.getCourseById);

router.patch(
  '/:id',
  checkRole([userRoles.lecturer]),
  validateUpdateCourse,
  courseController.updateCourse
);

router.delete(
  '/:id',
  checkRole([userRoles.lecturer]),
  courseController.deleteCourse
);

module.exports = router; 