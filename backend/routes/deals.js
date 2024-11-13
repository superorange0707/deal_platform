const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const authenticateToken = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const dealValidation = [
  body('title').notEmpty().trim(),
  body('type').notEmpty().isIn(['property', 'car', 'insurance']),
  body('amount').isNumeric(),
  body('insurance_type')
    .if(body('type').equals('insurance'))
    .notEmpty()
    .withMessage('Insurance type is required for insurance deals'),
  body('coverage')
    .if(body('type').equals('insurance'))
    .isNumeric()
    .withMessage('Coverage amount is required for insurance deals'),
];

// GET all deals
router.get('/', authenticateToken, dealController.getAllDeals);

// POST create new deal
router.post('/', authenticateToken, dealValidation, dealController.createDeal);

// PUT update deal
router.put('/:id', authenticateToken, dealController.updateDeal);

// DELETE deal
router.delete('/:id', authenticateToken, dealController.deleteDeal);

// POST analyze deal
router.post('/:id/analyze', authenticateToken, dealController.analyzeDeal);

module.exports = router;