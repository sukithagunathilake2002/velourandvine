const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/ReservationController");
const { protect } = require("../middleware/authMiddleware");

// User routes
router.post("/", protect, ReservationController.createReservation);
router.get("/my", protect, ReservationController.getMyReservations);
router.put("/:id", protect, ReservationController.updateReservation);
router.delete("/:id", protect, ReservationController.deleteReservation);
router.get("/check-availability", ReservationController.checkAvailability);



// Staff
router.get("/", protect, ReservationController.getAllReservations); // Add role-check if needed
router.patch("/status/:id", protect, ReservationController.updateReservationStatus);
router.get("/:id", protect, ReservationController.getReservationById);

module.exports = router;
