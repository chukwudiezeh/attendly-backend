const express = require('express');
const router = express.Router();
const departmentCurriculumController = require('../controllers/departmentCurriculumController');
const { validateToken } = require('../middlewares/tokenValidator');
const { checkRole } = require('../middlewares/roleValidator');
const { userRoles } = require('../configs/constants');
const {
  validateCreateUpdate,
  validateAddCourses,
  validateRemoveCourses,
  validateGetLevelCourses,
  validateDepartmentId
} = require('../middlewares/validators/departmentCurriculumValidator');

/**
 * @route   POST /api/department-curricula
 * @desc    Create a new department curriculum
 * @access  Private (Admin)
 */
router.post(
  '/',
  validateToken,
  checkRole([userRoles.ADMIN]),
  validateCreateUpdate,
  departmentCurriculumController.createDepartmentCurriculum
);

/**
 * @route   GET /api/department-curricula
 * @desc    Get all department curricula
 * @access  Private
 */
router.get(
  '/',
  validateToken,
  departmentCurriculumController.getAllDepartmentCurricula
);

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
  validateGetLevelCourses,
  departmentCurriculumController.getDepartmentLevelCourses
);

/**
 * @route   PUT /api/department-curricula/:departmentId
 * @desc    Update department curriculum
 * @access  Private (Admin)
 */
router.put(
  '/:departmentId',
  validateToken,
  checkRole([userRoles.ADMIN]),
  validateDepartmentId,
  validateCreateUpdate,
  departmentCurriculumController.updateDepartmentCurriculum
);

/**
 * @route   POST /api/department-curricula/:departmentId/courses
 * @desc    Add courses to department curriculum
 * @access  Private (Admin)
 */
router.post(
  '/:departmentId/courses',
  validateToken,
  checkRole([userRoles.ADMIN]),
  validateAddCourses,
  departmentCurriculumController.addCourses
);

/**
 * @route   DELETE /api/department-curricula/:departmentId/courses
 * @desc    Remove courses from department curriculum
 * @access  Private (Admin)
 */
router.delete(
  '/:departmentId/courses',
  validateToken,
  checkRole([userRoles.ADMIN]),
  validateRemoveCourses,
  departmentCurriculumController.removeCourses
);

/**
 * @route   DELETE /api/department-curricula/:departmentId
 * @desc    Delete department curriculum
 * @access  Private (Admin)
 */
router.delete(
  '/:departmentId',
  validateToken,
  checkRole([userRoles.ADMIN]),
  validateDepartmentId,
  departmentCurriculumController.deleteDepartmentCurriculum
);

/**
 * @route   GET /api/department-curricula/:departmentId/stats
 * @desc    Get course statistics for a department
 * @access  Private
 */
router.get(
  '/:departmentId/stats',
  validateToken,
  validateDepartmentId,
  departmentCurriculumController.getDepartmentCurriculumStats
);

module.exports = router; 