// Update user course status
async updateUserCourseStatus(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = userCourseValidator.updateStatus.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => detail.message)
        });
      }

      const updatedUserCourse = await userCourseService.updateUserCourseStatus(id, value.status);

      if (!updatedUserCourse) {
        return res.status(404).json({
          success: false,
          message: 'User course not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User course status updated successfully',
        data: updatedUserCourse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update user course status'
      });
    }
  }

  // Get course participants
  async getCourseParticipants(req, res) {
    try {
      const { courseId } = req.params;
      const { academicYear, semester } = req.query;

      if (!courseId || !academicYear || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Course ID, academic year, and semester are required'
        });
      }

      const participants = await userCourseService.getCourseParticipants(courseId, academicYear, semester);

      return res.status(200).json({
        success: true,
        message: 'Course participants retrieved successfully',
        data: participants,
        count: participants.length
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve course participants'
      });
    }
  }

  // Remove user from course
  async removeUserCourse(req, res) {
    try {
      const { id } = req.params;

      const removedUserCourse = await userCourseService.removeUserCourse(id);

      if (!removedUserCourse) {
        return res.status(404).json({
          success: false,
          message: 'User course not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User removed from course successfully',
        data: removedUserCourse
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to remove user from course'
      });
    }
  }

  // Get user's semester courses
  async getUserSemesterCourses(req, res) {
    try {
      const { userId, academicYear, semester } = req.params;

      const courses = await userCourseService.getUserSemesterCourses(userId, academicYear, semester);

      return res.status(200).json({
        success: true,
        message: 'User semester courses retrieved successfully',
        data: courses,
        count: courses.length
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve user semester courses'
      });
    }
  }