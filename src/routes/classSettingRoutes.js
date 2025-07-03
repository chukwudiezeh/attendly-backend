const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/tokenValidator');
const {
  validateCreateClassSetting,
  validateUpdateClassSetting,
  validateId,
  validateCourseId
} = require('../middlewares/validators/classSettingValidator');
const classSettingController = require('../controllers/classSettingController');

// Create class setting
router.post('/',
  validateToken,
  validateCreateClassSetting,
  classSettingController.createClassSetting
);

// Get all class settings
router.get('/',
  validateToken,
  classSettingController.getAllClassSettings
);

// Get class setting by ID
router.get('/:id',
  validateToken,
  validateId,
  classSettingController.getClassSettingById
);

// Get class setting by course
router.get('/course/:courseId',
  validateToken,
  validateCourseId,
  classSettingController.getClassSettingByCourse
);

// Update class setting
router.put('/:id',
  validateToken,
  validateId,
  validateUpdateClassSetting,
  classSettingController.updateClassSetting
);

// Update class setting by course
router.put('/course/:courseId',
  validateToken,
  validateCourseId,
  validateUpdateClassSetting,
  classSettingController.updateClassSettingByCourse
);

// Delete class setting
router.delete('/:id',
  validateToken,
  validateId,
  classSettingController.deleteClassSetting
);

// Reset class setting to default
router.post('/course/:courseId/reset',
  validateToken,
  validateCourseId,
  classSettingController.resetToDefault
);

module.exports = router; 