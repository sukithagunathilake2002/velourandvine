const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");

router.put("/:id", promotionController.addOrUpdatePromotion);  // Add/Update Promotion
router.delete("/:id", promotionController.removePromotion);  // Remove Promotion

module.exports = router;
