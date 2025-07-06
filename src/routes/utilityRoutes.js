const express = require('express');
const router = express.Router();
const { validateFacultyId } = require('../middlewares/validators/utilityValidator');
const UtilityController = require('../controllers/utilityController');

// Get all academic years
router.get('/academic-years', UtilityController.getAcademicYears);

// Get all faculties
router.get('/faculties', UtilityController.getFaculties);
router.get('/departments', UtilityController.getAllDepartments);

// Get departments by faculty
router.get('/faculties/:facultyId/departments', validateFacultyId, UtilityController.getDepartmentsByFaculty);

module.exports = router;