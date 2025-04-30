const express = require("express");
const router = express.Router();
const { getOrderRecommendations } = require("../controllers/orderRecommendationsController");

// Route: GET /orders/recommendations/:customerId
router.get("/:customerId", getOrderRecommendations);

module.exports = router;
