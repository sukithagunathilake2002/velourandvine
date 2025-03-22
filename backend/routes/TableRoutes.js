const express = require("express");
const {
  getAllTables,
  getTableById,
  addTable,
  updateTable,
  deleteTable
} = require("../controllers/TableController");

const router = express.Router();

// ✅ Get all tables
router.get("/", getAllTables);

// ✅ Get a single table by ID
router.get("/:id", getTableById);

// ✅ Create a new table
router.post("/", addTable);

// ✅ Update an existing table
router.put("/:id", updateTable);

// ✅ Delete a table
router.delete("/:id", deleteTable);

module.exports = router;
