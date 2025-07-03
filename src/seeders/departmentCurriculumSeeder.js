const DepartmentCurriculum = require('../models/DepartmentCurriculum');
const Department = require('../models/Department');
const Course = require('../models/Course');
const departmentCurricula = require('./data/departmentCurriculum');
const AcademicYear = require('../models/AcademicYear');
const Seeder = require('../utils/seeder');

async function getDepartmentCurriculaData() {
  try {
    // Get all departments
    const departments = await Department.find({});
    if (!departments.length) {
      throw new Error('No departments found in the database');
    }

    // Get all academic years (assuming you have this)
    const academicYear = await AcademicYear.findOne({isCurrentYear: true});
    if (!academicYear) {
      throw new Error('No active academic years found in the database');
    }

    const flattenedCurriculum = [];

    await Promise.all(
      departmentCurricula.map(async (curriculum) => {
        const department = departments.find(dept => dept.name === curriculum.department);
        if (!department) {
          console.warn(`Department not found: ${curriculum.department}`);
          return null;
        }

        await Promise.all(
          curriculum.courses.map(async (courseData) => {
            const course = await Course.findOne({ code: courseData.code });
            if (!course) {
              console.warn(`Course not found: ${courseData.code}`);
              return null;
            }
            flattenedCurriculum.push({
              course: course._id,
              level: courseData.level || parseInt(courseData.code.match(/\d{3}/)[0].charAt(0)) * 100,
              semester: courseData.semester || (parseInt(courseData.code.match(/\d{3}/)[0].charAt(1)) % 2 === 1 ? 'first' : 'second'),
              courseType: courseData.courseType || (
                courseData.code.startsWith('GST') ? 'general' : 
                courseData.code.match(/^(MTH|PHY|CHM|BIO|STA|ENG)/) ? 'elective' : 'core'
              ),
              creditUnits: courseData.creditUnits || 3,
              academicYear: academicYear._id,
              department: department._id,
              status: curriculum.status
            });
          })
        );
      })
    );

    return flattenedCurriculum.filter(Boolean);
  } catch (error) {
    console.error('Error preparing department curricula data:', error);
    throw error;
  }
}

async function seedDepartmentCurricula() {
  try {
    const curricula = await getDepartmentCurriculaData();
    const result = await Seeder.seed(DepartmentCurriculum, curricula, { clearBefore: true });
    console.log('Department curricula seeded successfully');
    return result;
  } catch (error) {
    console.error('Error seeding department curricula:', error);
    throw error;
  }
}

module.exports = seedDepartmentCurricula; 