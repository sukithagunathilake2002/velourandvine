const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/ReservationController");

// ✅ Create a new reservation
router.post("/", ReservationController.createReservation);

// ✅ Get all reservations
router.get("/", ReservationController.getAllReservations);

// ✅ Get a reservation by ID
router.get("/:id", ReservationController.getReservationById);

// ✅ Update a reservation
router.put("/:id", ReservationController.updateReservation);

// ✅ Delete a reservation
router.delete("/:id", ReservationController.deleteReservation);

module.exports = router;
