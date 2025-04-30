// routes/promotionController.js
const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// Add or update promotion
router.post('/:id/promotion', promotionController.addOrUpdatePromotion);

// Remove promotion
router.delete('/:id/promotion', promotionController.removePromotion);

module.exports = router;
