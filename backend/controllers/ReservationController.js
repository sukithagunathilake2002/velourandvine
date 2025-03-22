const Reservation = require("../models/reservationModel");
const Table = require("../models/Tables");

// ✅ Create a New Reservation
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, tableId, date, timeSlot } = req.body;


    // Check if the table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Selected table does not exist." });
    }

    // Check if the table is already reserved for the given date and time
    const existingReservation = await Reservation.findOne({ tableId, date, timeSlot });
    if (existingReservation) {
      return res.status(400).json({ message: "Table is already reserved for the selected date and time slot." });
    }

    // Create a new reservation
    const newReservation = new Reservation({
      customerName,
      customerEmail,
      customerPhone,
      tableId,
      date,
      timeSlot,
      status: "pending",
    });

    await newReservation.save();
    res.status(201).json({ message: "Reservation created successfully!", reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error: error.message });
  }
};

// ✅ Get All Reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("tableId", "number capacity status") // Show table details
      .sort({ date: 1, timeSlot: 1 }); // Sort by date and time slot

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
};

// ✅ Get a Single Reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("tableId", "number capacity status");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error: error.message });
  }
};

// ✅ Update a Reservation
exports.updateReservation = async (req, res) => {
  try {
    const { customerName, customerPhone, date, timeSlot, status } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Update fields if provided
    if (customerName) reservation.customerName = customerName;
    if (customerPhone) reservation.customerPhone = customerPhone;
    if (date) reservation.date = date;
    if (timeSlot) reservation.timeSlot = timeSlot;
    if (status) reservation.status = status;

    await reservation.save();
    res.status(200).json({ message: "Reservation updated successfully!", reservation });
  } catch (error) {
    res.status(500).json({ message: "Error updating reservation", error: error.message });
  }
};

// ✅ Delete a Reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation", error: error.message });
  }
};
