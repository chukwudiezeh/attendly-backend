const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { statusCodes } = require('../configs/constants');

class UserController {
  /**
   * @desc    Update user details
   * @route   PUT /api/users/:id
   * @access  Private
   */
  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).populate(['department', 'academicYear']);

      if (!updatedUser) {
        return errorResponse(res, null, statusCodes.notFound, 'User not found');
      }

      return successResponse(res, updatedUser, statusCodes.ok, 'User updated successfully');
    } catch (error) {
      return errorResponse(res, error, statusCodes.serverError, 'Error updating user');
    }
  }
}

module.exports = new UserController();