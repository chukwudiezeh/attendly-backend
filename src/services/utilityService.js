const AcademicYear = require('../models/AcademicYear');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

class UtilityService {
  /**
   * Get all academic years sorted by most recent first
   * @returns {Promise<Array>} Array of academic years
   */
  static async getAcademicYears() {
    return AcademicYear.find()
      .sort({ startYear: -1 });
  }

  static async getCurrentAcademicYear() {
    return AcademicYear.findOne({ isCurrent: true });
  }
  
  /**
   * Get all faculties sorted alphabetically
   * @returns {Promise<Array>} Array of faculties
   */
  static async getFaculties() {
    return Faculty.find()
      .sort({ name: 1 });
  }

  /**
   * Get departments by faculty ID sorted alphabetically
   * @param {string} facultyId - The faculty ID
   * @returns {Promise<Array>} Array of departments
   */
  static async getDepartmentsByFaculty(facultyId) {
    return Department.find({ faculty: facultyId })
      .sort({ name: 1 })
      .populate('faculty', 'name');
  }

  static async getAllDepartments() {
    return Department.find({})
      .sort({ name: 1 });
  }
}

module.exports = UtilityService;
