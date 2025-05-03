// routes/OrderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

// Define the routes for order management
router.post("/create", orderController.createOrder); // Create a new order
router.get("/all", orderController.getOrders); // View all orders or orders by customer ID
router.put('/update/:id', orderController.updateOrder); // Update the status of an order
router.delete("/delete/:id", orderController.deleteOrder); // Delete an order
router.get("/status/:orderId", orderController.getOrderStatus);

module.exports = router;
