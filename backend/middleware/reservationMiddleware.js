/*const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Authentication Middleware: Ensure user is logged in
exports.authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer <token>)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found. Unauthorized access." });
    }

    // Attach the authenticated user to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

// ✅ Authorization Middleware: Ensure user is a staff member
exports.authorizeStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ message: "Access denied. Staff members only." });
  }
  next();
};

// ✅ Validate Table Middleware: Ensure the table exists
const Table = require("../models/Tables");

exports.validateTable = async (req, res, next) => {
  try {
    const { tableId } = req.body;

    // Check if table exists in the database
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found. Please select a valid table." });
    }

    // Attach table details to the request object
    req.table = table;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error validating table.", error: error.message });
  }
}; */
