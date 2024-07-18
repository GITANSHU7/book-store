const express = require('express');
const router = express.Router();

const roleController = require('../controller/roleController');
const isAuthenticated = require('../middleware/middleware');

router.post('/create', isAuthenticated, roleController.createRole);
router.post('/list', isAuthenticated, roleController.getRoles);
router.post('/assign', isAuthenticated, roleController.assignRole);
router.get('/get/:id', isAuthenticated, roleController.getRoleById);

module.exports = router;