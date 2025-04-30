const Order = require("../models/OrderModel");
const Menu = require("../models/menuModel");
const { processPayment } = require("../utils/PaymentUtils"); // Assuming you have a payment processing utility

// Create a new order with items from the cart
exports.createOrder = async (req, res) => {
    try {
        const { customerId, items, paymentMethod } = req.body;

        let totalPrice = 0;
        const orderItems = [];

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

        const paymentResult = await processPayment(paymentMethod, totalPrice);

        if (paymentResult.status === "failed") {
            return res.status(400).json({ message: "Payment failed", error: paymentResult.error });
        }

        const newOrder = new Order({
            customerId,
            items: orderItems,
            totalPrice,
            paymentMethod,
            paymentStatus: "Paid",
            status: "Pending",
        });

        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View all orders or a specific order by customer ID
exports.getOrders = async (req, res) => {
    try {
        const { customerId } = req.query;

        const orders = customerId
            ? await Order.find({ customerId }).populate("items.menuItemId")
            : await Order.find().populate("items.menuItemId");

        res.json(orders);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "Verifying", "Preparing", "Ready", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order status updated successfully", order: updatedOrder });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Placeholder: Get recommendations (to be implemented later)
exports.getRecommendations = async (req, res) => {
    res.status(501).json({ message: "Recommendations feature not implemented yet" });
};
