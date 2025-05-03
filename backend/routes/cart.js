const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided in request"); // ✅ Debug
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    console.log("JWT_SECRET in cart.js:", process.env.JWT_SECRET); // ✅ Debug
    console.log("Token received:", token); // ✅ Debug
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // ✅ Debug
    req.userId = decoded.id; // Matches generateToken’s { id }
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message); // ✅ Debug
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Mock cart storage (replace with MongoDB later)
const carts = {};

// Get cart for user
router.get("/:userId", authMiddleware, (req, res) => {
  const { userId } = req.params;
  if (req.userId !== userId) {
    console.log(`Unauthorized access: req.userId=${req.userId}, userId=${userId}`); // ✅ Debug
    return res.status(403).json({ message: "Unauthorized" });
  }
  
  const cart = carts[userId] || { items: [] };
  console.log(`Cart fetched for user ${userId}:`, cart); // ✅ Debug
  res.json(cart);
});

// Save/update cart for user
router.post("/:userId", authMiddleware, (req, res) => {
  const { userId } = req.params;
  if (req.userId !== userId) {
    console.log(`Unauthorized update: req.userId=${req.userId}, userId=${userId}`); // ✅ Debug
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { items } = req.body;
  carts[userId] = { items };
  console.log(`Cart updated for user ${userId}:`, carts[userId]); // ✅ Debug
  res.json({ message: "Cart updated", items });
});

module.exports = router;