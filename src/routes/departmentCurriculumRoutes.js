const express = require('express');
const router = express.Router();
const departmentCurriculumController = require('../controllers/departmentCurriculumController');
const { validateToken } = require('../middlewares/tokenValidator');
// const { checkRole } = require('../middlewares/roleValidator');
const { userRoles } = require('../configs/constants');
const {
  validateCreateUpdate,
  validateAddCourses,
  validateRemoveCourses,
  validateGetLevelCourses,
  validateDepartmentId
} = require('../middlewares/validators/departmentCurriculumValidator');

/**
 * @route   GET /api/department-curricula/:departmentId
 * @desc    Get curriculum for a specific department
 * @access  Private
 */
router.get(
  '/:departmentId',
  validateToken,
  validateDepartmentId,
  departmentCurriculumController.getDepartmentCurriculum
);

/**
 * @route   GET /api/department-curricula/:departmentId/courses
 * @desc    Get courses for a specific level and semester in a department
 * @param   {string} departmentId - The ID of the department
 * @query   {string} level - The level of the courses - optional
 * @query   {string} semester - The semester of the courses - optional
 * @access  Private
 */
router.get(
  '/:departmentId/courses',
  validateToken,
  validateDepartmentId,
  validateGetLevelCourses,
  departmentCurriculumController.getDepartmentLevelCourses
);

module.exports = router; 