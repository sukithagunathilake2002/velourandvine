const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "Table number is required"],
    unique: true,
    min: [1, "Table number must be at least 1"],
  }, // Table number
  capacity: {
    type: Number,
    required: [true, "Table capacity is required"],
    min: [1, "Table capacity must be at least 1"],
    max: [20, "Table capacity cannot exceed 20"],
  }, // Number of seats
  status: {
    type: String,
    enum: ["available", "reserved", "occupied"],
    default: "available",
  }, // Availability status
}, { timestamps: true });

module.exports = mongoose.model("Table", tableSchema);
