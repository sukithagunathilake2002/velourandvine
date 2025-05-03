const Reservation = require("../models/reservationModel");
const Table = require("../models/Tables");
const { sendStatusUpdateEmail } = require("../utils/sendEmail");


// 🔐 Create a reservation for authenticated user
exports.createReservation = async (req, res) => {
  try {
    const { tableId, date, timeSlot } = req.body;

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ message: "Table not found." });

    const existing = await Reservation.findOne({ tableId, date, timeSlot });
    if (existing) return res.status(400).json({ message: "Table is already reserved at that time." });

    const reservation = new Reservation({
      userId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      tableId,
      date,
      timeSlot
    });

    await reservation.save();
    res.status(201).json({ message: "Reservation created!", reservation });
  } catch (error) {
    res.status(500).json({ message: "Reservation creation failed", error: error.message });
  }
};

// 🔐 Get all reservations (STAFF ONLY)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "name email phone")
      .populate("tableId", "number capacity status")
      .sort({ date: 1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all reservations", error: error.message });
  }
};

// 🔐 Get current user's reservations
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .populate("tableId", "number capacity status")
      .sort({ date: 1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your reservations", error: error.message });
  }
};

// 🔐 Get one reservation (STAFF ONLY or Owner - optional logic can be added)
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("tableId", "number capacity status")
      .populate("userId", "name email");

    if (!reservation) return res.status(404).json({ message: "Not found" });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

// 🔐 Update (only user’s own)
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    if (reservation.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const { customerName, customerPhone, date, timeSlot } = req.body;

    if (customerName) reservation.customerName = customerName;
    if (customerPhone) reservation.customerPhone = customerPhone;
    if (date) reservation.date = date;
    if (timeSlot) reservation.timeSlot = timeSlot;

    await reservation.save();
    res.status(200).json({ message: "Reservation updated", reservation });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 🔐 Delete (only user’s own)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Not found" });

    if (reservation.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await reservation.deleteOne();
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

// 🔐 Update status (STAFF only)
exports.updateReservationStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("userId", "name email"); // Required for email

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const newStatus = req.body.status || reservation.status;
    reservation.status = newStatus;
    await reservation.save();

    // ✅ Send email
    await sendStatusUpdateEmail(
      reservation.customerEmail,
      reservation.customerName,
      newStatus,
      reservation
    );

    res.status(200).json({ message: "Status updated and email sent", reservation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};



// ➤ Check Availability
exports.checkAvailability = async (req, res) => {
  const { tableId, date, timeSlot } = req.query;

  if (!tableId || !date || !timeSlot) {
    return res.status(400).json({ message: "Missing parameters." });
  }

  const existing = await Reservation.findOne({ tableId, date, timeSlot });

  return res.json({ isReserved: !!existing });
};