// controllers/OrderController.js
const Order = require("../models/OrderModel");
const Menu = require("../models/menuModel");
const { processPayment } = require("../utils/PaymentUtils"); // Assuming you have a payment processing utility

// Create a new order with items from the cart
exports.createOrder = async (req, res) => {
    try {
        const { customerId, items, paymentMethod } = req.body;

        // Initialize variables for total price and order items
        let totalPrice = 0;
        const orderItems = [];

        // Fetch menu details and calculate subtotal for each item
        for (const item of items) {
            const menuItem = await Menu.findById(item.menuItemId);

            if (!menuItem) {
                return res.status(404).json({ message: "Menu item not found" });
            }

            const itemPrice = menuItem.getActualPrice();
            const subtotal = itemPrice * item.quantity;
            totalPrice += subtotal;

            orderItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                specialInstructions: item.specialInstructions,
                price: itemPrice,
                subtotal: subtotal,
            });
        }

        // Handle payment
        const paymentResult = await processPayment(paymentMethod, totalPrice);

        // If payment fails, return a failure message
        if (paymentResult.status === "failed") {
            return res.status(400).json({ message: "Payment failed", error: paymentResult.error });
        }

        // Create a new order object
        const newOrder = new Order({
            customerId,
            items: orderItems,
            totalPrice,
            paymentMethod,
            paymentStatus: "Paid", // If payment was successful
            status: "Pending", // Initially set the order status to Pending
        });

        // Save the new order to the database
        await newOrder.save();

        // Send a response with the created order
        res.status(201).json({ message: "Order created successfully", order: newOrder });

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};

// View all orders or a specific order by customer ID
exports.getOrders = async (req, res) => {
    try {
        const { customerId } = req.query;

        const orders = customerId
            ? await Order.find({ customerId }).populate("items.menuItemId") // Fetch orders by customer ID
            : await Order.find().populate("items.menuItemId"); // Fetch all orders

        // Send the response with the orders
        res.json(orders);

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};

// Update the status of an order (e.g., from "Pending" to "Preparing")
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Ensure the status is valid before updating
        const validStatuses = ["Pending", "Verifying", "Preparing", "Ready", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find and update the order status
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true } // Return the updated order
        );

        // If no order found, return a 404 error
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        // Send the response with the updated order status
        res.json({ message: "Order status updated successfully", order: updatedOrder });

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the order by ID
        const deletedOrder = await Order.findByIdAndDelete(id);

        // If no order found, return a 404 error
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

        // Send a response confirming the deletion
        res.json({ message: "Order deleted successfully" });

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};
