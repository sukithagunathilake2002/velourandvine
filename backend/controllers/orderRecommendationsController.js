const Order = require("../models/OrderModel");  // Corrected path
const Menu = require("../models/menuModel"); // Use the correct file name and path



// 🔍 Get last ordered items by customer
const getOrderRecommendations = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const lastOrder = await Order.findOne({ customerId })
      .sort({ createdAt: -1 })
      .populate("items.menuItemId");

    if (!lastOrder || lastOrder.items.length === 0) {
      return res.status(200).json({ recommendations: [] });
    }

    const recommendations = lastOrder.items.map((item) => ({
      name: item.menuItemId.name,
      description: item.menuItemId.description,
      price: item.menuItemId.price,
    }));

    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order-based recommendations", error });
  }
};

module.exports = { getOrderRecommendations };
