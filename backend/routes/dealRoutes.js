const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const authenticateToken = require('../middleware/auth');

// ... existing routes ...
router.post('/:id/analyze', authenticateToken, dealController.analyzeDeal);

module.exports = router; 