const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

// Get user by ID
router.get('/:id', authenticateToken, userController.getCurrentUser);
router.put('/:id/password', authenticateToken, userController.changePassword);

module.exports = router; 