const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateToken } = require('../middlewares/tokenValidator');

router.put('/:id', validateToken, userController.updateUser);

module.exports = router;