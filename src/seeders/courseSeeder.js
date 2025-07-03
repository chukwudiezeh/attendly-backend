const Course = require('../models/Course');
const Seeder = require('../utils/seeder');
const courses = require('./data/course');

async function seedCourses() {
  try {
    //filter courses - remove duplicates
    const uniqueCourses = courses.filter((course, index, self) =>
      index === self.findIndex((t) => t.code === course.code)
    );

    const result = await Seeder.seed(Course, uniqueCourses, { clearBefore: true });
    console.log('Courses seeded successfully');
    return result;
  } catch (error) {
    console.error('Error seeding courses:', error);
    throw error;
  }
}

module.exports = seedCourses; 