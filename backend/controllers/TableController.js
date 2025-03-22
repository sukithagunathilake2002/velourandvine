const Table = require("../models/Tables");
const Reservation = require("../models/reservationModel"); // Import Reservation model

// ✅ Get All Tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 }); // Sort tables by number
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables", error: error.message });
  }
};

// ✅ Get Table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.status(200).json(table);
  } catch (error) {
    res.status(500).json({ message: "Error fetching table", error: error.message });
  }
};

// ✅ Create a New Table (with Validation)
exports.addTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;

    // Check if table number already exists
    const existingTable = await Table.findOne({ number });
    if (existingTable) {
      return res.status(400).json({ message: `Table number ${number} already exists.` });
    }

    // Ensure capacity is within range
    if (capacity < 1 || capacity > 20) {
      return res.status(400).json({ message: "Capacity must be between 1 and 20 seats." });
    }

    const newTable = new Table({ number, capacity });
    await newTable.save();

    res.status(201).json({ message: `Table ${number} added successfully!`, table: newTable });
  } catch (error) {
    res.status(500).json({ message: "Error adding table", error: error.message });
  }
};

// ✅ Update Table (Validation Included)
exports.updateTable = async (req, res) => {
  try {
    const { number, capacity, status } = req.body;

    // Check if the new table number already exists (excluding the current one)
    const existingTable = await Table.findOne({ number, _id: { $ne: req.params.id } });
    if (existingTable) {
      return res.status(400).json({ message: `Table number ${number} is already assigned to another table.` });
    }

    // Ensure capacity is within range
    if (capacity < 1 || capacity > 20) {
      return res.status(400).json({ message: "Capacity must be between 1 and 20 seats." });
    }

    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      { number, capacity, status },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: `Table ${number} updated successfully`, table: updatedTable });
  } catch (error) {
    res.status(500).json({ message: "Error updating table", error: error.message });
  }
};

// ✅ Delete Table (Ensure No Active Reservations)
exports.deleteTable = async (req, res) => {
  try {
    // Check if the table has active reservations
    const existingReservations = await Reservation.findOne({ tableId: req.params.id, status: "confirmed" });

    if (existingReservations) {
      return res.status(400).json({ message: "Cannot delete a table with active reservations." });
    }

    const deletedTable = await Table.findByIdAndDelete(req.params.id);
    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: `Table ${deletedTable.number} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting table", error: error.message });
  }
};
