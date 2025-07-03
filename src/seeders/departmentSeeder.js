const Department = require('../models/Department');
const Faculty = require('../models/Faculty');
const Seeder = require('../utils/seeder');

// Temporary departments data structure
const tempDepartments = [
  {
    facultyName: "Arts",
    departments: [
      "English",
      "Foreign Languages",
      "History and International Studies",
      "Linguistics, African Languages, Literatures and Communication Arts",
      "Music",
      "Philosophy",
      "Religions and Peace Studies",
      "Theatre Arts"
    ]
  },
  {
    facultyName: "Basic Medical Sciences",
    departments: [
      "Anatomy",
      "Chemical Pathology",
      "Haematology and Blood Transfusion",
      "Medical Biochemistry",
      "Medical Microbiology and Parasitology",
      "Pathology and Forensic Medicine",
      "Pharmacology",
      "Physiology"
    ]
  },
  {
    facultyName: "Clinical Sciences",
    departments: [
      "Anesthesia",
      "Behavioural Medicine",
      "Community Health and Primary Health Care",
      "Surgery",
      "Medicine",
      "Obstetrics & Gynaecology",
      "Paediatrics & Child Health",
      "Nursing",
      "Radiology"
    ]
  },
  {
    facultyName: "Dentistry",
    departments: [
      "Child Dental Health",
      "Oral and Maxillofacial Surgery",
      "Oral Pathology and Oral Medicine",
      "Preventive Dentistry",
      "Restorative Dentistry",
      "Orthodontics"
    ]
  },
  {
    facultyName: "Education",
    departments: [
      "Educational Management",
      "Human Kinetics, Sports and Health Education",
      "Language Arts and Social Science Education",
      "Science and Technology Education",
      "Educational Foundations and Counselling Psychology"
    ]
  },
  {
    facultyName: "Engineering",
    departments: [
      "Aeronautics and Astronautics Engineering",
      "Aerospace Engineering",
      "Chemical Engineering",
      "Computer and Electronics Engineering",
      "Mechanical Engineering"
    ]
  },
  {
    facultyName: "Law",
    departments: [
      "Business Law",
      "International and Islamic Law",
      "International Law and Jurisprudence",
      "Law",
      "Public and Private Law"
    ]
  },
  {
    facultyName: "Management Sciences",
    departments: [
      "Accounting",
      "Banking and Finance",
      "Business Administration",
      "Industrial Relations and Human Resource Management",
      "Insurance",
      "Local Government Administration",
      "Management Technology",
      "Marketing",
      "Public Administration"
    ]
  },
  {
    facultyName: "Science",
    departments: [
      "Biochemistry",
      "Botany",
      "Chemistry",
      "Computer Science",
      "Fisheries",
      "Mathematics",
      "Microbiology",
      "Physics",
      "Science Laboratory Technology",
      "Zoology and Environmental Biology"
    ]
  },
  {
    facultyName: "Social Sciences",
    departments: [
      "Economics",
      "Geography and Planning",
      "Political Science",
      "Psychology",
      "Sociology"
    ]
  },
  {
    facultyName: "Allied Health Sciences",
    departments: [
      "Medical Laboratory Science",
      "Physiotherapy",
      "Radiography"
    ]
  },
  {
    facultyName: "Agriculture",
    departments: [
      "Agricultural Economics",
      "Agricultural Extension and Rural Development",
    ]
  },
  {
    facultyName: "Communication",
    departments: [
      "Broadcasting",
      "Journalism",
      "Public Relations and Advertising"
    ]
  },
  {
    facultyName: "Transport",
    departments: [
      "Transport Management and Operations",
      "Transport Planning and Policy",
      "Logistics and Supply Chain Management",
      "Transport Technology and Infrastructure"
    ]
  }
];

async function getDepartmentsData() {
  // Get all faculties
  const faculties = await Faculty.find({});
  
  if (faculties.length === 0) {
    throw new Error('No faculties found. Please run faculty seeder first.');
  }

  // Transform temp departments into actual department objects
  const departments = [];
  
  tempDepartments.forEach(temp => {
    // Find matching faculty
    const faculty = faculties.find(f => f.name === temp.facultyName);
    if (faculty) {
      // Create department objects for each department name
      temp.departments.forEach(deptName => {
        departments.push({
          name: deptName,
          faculty: faculty._id,
          description: `Department of ${deptName}`
        });
      });
    }
  });

  if (departments.length === 0) {
    throw new Error('No departments could be created. Check faculty names match.');
  }

  return departments;
}

async function seedDepartments() {
  try {
    const departments = await getDepartmentsData();
    const result = await Seeder.seed(Department, departments, { clearBefore: true });
    console.log('Departments seeded successfully');
    return result;
  } catch (error) {
    console.error('Error seeding departments:', error);
    throw error;
  }
}

module.exports = seedDepartments; 