require('dotenv').config();
const db = require('../configs/db');
const seedFaculties = require('./facultySeeder');
const seedDepartments = require('./departmentSeeder');
const seedCourses = require('./courseSeeder');
const seedAcademicYears = require('./academicYearSeeder');
const seedDepartmentCurriculums = require('./departmentCurriculumSeeder');

async function seedAll() {
  try {
    // Connect to database
    await db.initializeConnection();
    console.log('Connected to database');

    // Run seeders in sequence (order matters due to relationships)
    console.log('\n--- Seeding Faculties ---');
    await seedFaculties();
    
    console.log('\n--- Seeding Departments ---');
    await seedDepartments();

    console.log('\n--- Seeding Academic Years ---');
    await seedAcademicYears();

    console.log('\n--- Seeding Courses ---');
    await seedCourses();

    console.log('\n--- Seeding Department Curriculums ---');
    await seedDepartmentCurriculums();

    console.log('\nAll data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run if called directly (node seeders/index.js)
if (require.main === module) {
  seedAll();
} 