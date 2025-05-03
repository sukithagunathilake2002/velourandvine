// controllers/OrderController.js
const Order = require("../models/OrderModel");
const Menu = require("../models/menuModel");
const { processPayment } = require("../utils/PaymentUtils"); // Assuming you have a payment processing utility


exports.createOrder = async (req, res) => {
  try {
    console.log("Received order request body:", JSON.stringify(req.body, null, 2)); // ✅ Debug
    const { customerId, items, paymentMethod } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "customerId is required" });
    }

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
    console.log("Order saved to MongoDB:", JSON.stringify(newOrder, null, 2)); // ✅ Debug
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
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

// Update order details (status, price, and special instructions)
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, totalPrice, items } = req.body;

        // Validate status if provided
        if (status) {
            const validStatuses = ["Pending", "Verifying", "Preparing", "Ready", "Completed", "Cancelled"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
        }

        // Build update object dynamically
        const updateFields = { updatedAt: new Date() };
        if (status) updateFields.status = status;
        if (totalPrice) updateFields.totalPrice = totalPrice;

        // If items are provided, update them
        let updatedItems = null;
        if (items && Array.isArray(items)) {
            updatedItems = items.map(item => ({
                menuItemId: item.menuItemId,
                name: item.name,
                quantity: item.quantity,
                specialInstructions: item.specialInstructions || "", // Update special instructions
                price: item.price,
                subtotal: item.subtotal || item.price * item.quantity // Recalculate subtotal if needed
            }));
            updateFields.items = updatedItems;

            // Recalculate totalPrice if items are updated
            if (!totalPrice) {
                updateFields.totalPrice = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
            }
        }

        // Find and update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).populate("items.menuItemId");

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order updated successfully", order: updatedOrder });

    } catch (error) {
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

// New function to get order status
exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ status: order.status });
  } catch (error) {
    console.error("Error fetching order status:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};