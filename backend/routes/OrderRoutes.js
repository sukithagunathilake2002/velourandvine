const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

// Order routes
router.post("/create", orderController.createOrder);           // Create a new order
router.get("/all", orderController.getOrders);                // View all orders or by customer ID
router.put("/update/:id", orderController.updateOrder);       // Update order
router.delete("/delete/:id", orderController.deleteOrder);    // Delete order
router.get("/status/:orderId", orderController.getOrderStatus); // Get order status

// ✅ NEW: Menu route (needed by React frontend)
router.get("/menu/all", orderController.getAllMenuItems);     // Get all menu items

// Route to fetch recommendations from Flask
router.get("/recommendations/:customerId", orderController.getRecommendations);

module.exports = router;