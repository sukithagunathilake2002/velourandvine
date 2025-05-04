const Order = require("../models/OrderModel");
const Menu = require("../models/menuModel");
const { processPayment } = require("../utils/PaymentUtils");

// ✅ Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log("Received order request body:", JSON.stringify(req.body, null, 2));
    const { customerId, items, paymentMethod } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "customerId is required" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
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
    console.log("Order saved to MongoDB:", JSON.stringify(newOrder, null, 2));
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error in createOrder:", error.message);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};

// ✅ Get all orders or by customerId
exports.getOrders = async (req, res) => {
  try {
    const { customerId } = req.query;

    const orders = customerId
      ? await Order.find({ customerId }).populate("items.menuItemId")
      : await Order.find().populate("items.menuItemId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

// ✅ Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalPrice, items } = req.body;

    const validStatuses = ["Pending", "Verifying", "Preparing", "Ready", "Completed", "Cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateFields = { updatedAt: new Date() };
    if (status) updateFields.status = status;
    if (totalPrice) updateFields.totalPrice = totalPrice;

    if (items && Array.isArray(items)) {
      const updatedItems = items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || "",
        price: item.price,
        subtotal: item.subtotal || item.price * item.quantity,
      }));
      updateFields.items = updatedItems;

      if (!totalPrice) {
        updateFields.totalPrice = updatedItems.reduce((acc, item) => acc + item.subtotal, 0);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updateFields }, { new: true }).populate("items.menuItemId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order", details: error.message });
  }
};

// ✅ Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order", details: error.message });
  }
};

// ✅ Get order status
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
    res.status(500).json({ error: "Failed to fetch order status", details: error.message });
  }
};

// ✅ Get all menu items (for React frontend)
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error.message);
    res.status(500).json({ error: "Failed to fetch menu items", details: error.message });
  }
};
