// routes/promotionRoutes.js
const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");

router.put("/:id", promotionController.addOrUpdatePromotion);
router.delete("/:id", promotionController.removePromotion);

module.exports = router;
