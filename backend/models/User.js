const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true, 
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] 
    },
    phone: { 
      type: String, 
      required: true, 
      unique: true, 
      match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"] 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 8, 
      validate: {
        validator: function(value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message: "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
