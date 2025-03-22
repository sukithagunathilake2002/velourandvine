const mongoose = require("mongoose");
const Table = require("./Tables");

const ReservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
    minlength: [3, "Customer name must be at least 3 characters long"]
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is required"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  customerPhone: {
    type: String,
    required: [true, "Customer phone number is required"],
    match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"]
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: [true, "Table selection is required"]
  },
  date: {
    type: String,
    required: [true, "Reservation date is required"],
    validate: {
      validator: function (value) {
        const today = new Date().setHours(0, 0, 0, 0); // Today's date
        const selectedDate = new Date(value).setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      message: "Reservation date must be today or a future date."
    }
  },
  timeSlot: {
    type: String,
    required: [true, "Reservation time slot is required"],
    enum: ["12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"]
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);
