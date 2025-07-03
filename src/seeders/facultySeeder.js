const Faculty = require('../models/Faculty');
const Seeder = require('../utils/seeder');

const faculties = [
    {
      name: "Arts",
      description: "Faculty of Arts"
    },
    {
      name: "Basic Medical Sciences",
      description: "Faculty of Basic Medical Sciences"
    },
    {
      name: "Clinical Sciences",
      description: "Faculty of Clinical Sciences"
    },
    {
      name: "Dentistry",
      description: "Faculty of Dentistry"
    },
    {
      name: "Education",
      description: "Faculty of Education"
    },
    {
      name: "Engineering",
      description: "Faculty of Engineering"
    },
    {
      name: "Law",
      description: "Faculty of Law"
    },
    {
      name: "Management Sciences",
      description: "Faculty of Management Sciences"
    },
    {
      name: "Science",
      description: "Faculty of Science"
    },
    {
      name: "Social Sciences",
      description: "Faculty of Social Sciences"
    },
    {
      name: "Allied Health Sciences",
      description: "Faculty of Allied Health Sciences"
    },
    {
      name: "Agriculture",
      description: "School of Agriculture"
    },
    {
      name: "Communication",
      description: "School of Communication"
    },
    {
      name: "Transport",
      description: "School of Transport"
    }
  ];

async function seedFaculties() {
  try {
    const result = await Seeder.seed(Faculty, faculties, { clearBefore: true });
    console.log('Faculties seeded successfully');
    return result;
  } catch (error) {
    console.error('Error seeding faculties:', error);
    throw error;
  }
}

module.exports = seedFaculties; 