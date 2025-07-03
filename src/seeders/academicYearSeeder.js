const AcademicYear = require('../models/AcademicYear');
const academicYears = require('./data/academicYear');
const Seeder = require('../utils/seeder');

/**
 * Seed academic years
 */
async function seedAcademicYears() {
  try {
    const result = await Seeder.seed(AcademicYear, academicYears, { clearBefore: true });
    console.log('Academic years seeded successfully');
    return result;
  } catch (error) {
    console.error('Error seeding academic years:', error);
    throw error;
  }
}

module.exports = seedAcademicYears; 