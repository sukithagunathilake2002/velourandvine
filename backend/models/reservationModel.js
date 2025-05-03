const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Enter a valid email."]
  },
  customerPhone: {
    type: String,
    required: true,
    match: [/^\d{10,15}$/, "Phone must be 10-15 digits"]
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date().setHours(0, 0, 0, 0);
        const selectedDate = new Date(value).setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      message: "Reservation date must be today or later."
    }
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ["12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"]
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);
