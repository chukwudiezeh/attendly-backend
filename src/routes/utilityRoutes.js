const express = require('express');
const router = express.Router();
const { validateFacultyId } = require('../middlewares/validators/utilityValidator');
const {
  getAcademicYears,
  getFaculties,
  getDepartmentsByFaculty
} = require('../controllers/utilityController');

// Get all academic years
router.get('/academic-years', getAcademicYears);

// Get all faculties
router.get('/faculties', getFaculties);

// Get departments by faculty
router.get('/faculties/:facultyId/departments', validateFacultyId, getDepartmentsByFaculty);

module.exports = router; 