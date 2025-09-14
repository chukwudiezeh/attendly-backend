require('dotenv').config();
const express = require("express");
const cors = require("cors");

const db = require("./src/configs/db");
const config = require("./src/configs/app");

//Routes Imports
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const departmentCurriculumRoutes = require("./src/routes/departmentCurriculumRoutes");
const utilityRoutes = require("./src/routes/utilityRoutes");
const userCourseRoutes = require("./src/routes/userCourseRoutes");
const classScheduleRoutes = require("./src/routes/classScheduleRoutes");
const classSettingRoutes = require("./src/routes/classSettingRoutes");
const classAttendanceRoutes = require("./src/routes/classAttendanceRoutes");
const classRoutes = require("./src/routes/classRoutes");

//Mounts
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

// Initialize DB
db.initializeConnection();

// Routes Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/department-curricula', departmentCurriculumRoutes);
app.use('/api/utilities', utilityRoutes);
app.use('/api/user-courses', userCourseRoutes);
app.use('/api/class-schedules', classScheduleRoutes);
app.use('/api/class-settings', classSettingRoutes);
app.use('/api/class-attendances', classAttendanceRoutes);
app.use('/api/classes', classRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Attendly Backend running smooooth");
});

app.listen(config.app.port, () => {
    console.log(`Server is running on port ${config.app.port}`);
});

module.exports = app;