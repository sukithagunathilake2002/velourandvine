// routes/recentOrders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel");

// ✅ Route: GET /recent-orders/:customerId
router.get("/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const recentOrder = await Order.findOne({ customerId })
      .sort({ createdAt: -1 });

    if (!recentOrder) {
      return res.status(404).json({ message: "No recent order found." });
    }

    res.json(recentOrder);
  } catch (error) {
    console.error("Error fetching recent order:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
