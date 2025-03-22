import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/ReservationForm.css";// Import unique styles

const ReservationForm = () => {
  const [tables, setTables] = useState([]); // Stores available tables
   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    tableId: "",
    date: "",
    timeSlot: "",
  });

  const [errors, setErrors] = useState({}); // Stores validation errors
  const timeSlots = ["12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"]; // Available time slots

  // ✅ Fetch available tables
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tables");
      setTables(res.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  // ✅ Validate Inputs Before Submission
  const validateForm = () => {
    let newErrors = {};

    if (!formData.customerName || formData.customerName.length < 3) {
      newErrors.customerName = "Name must be at least 3 characters long.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.customerEmail || !emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address.";
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!formData.customerPhone || !phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = "Phone number must be between 10 and 15 digits.";
    }

    if (!formData.tableId) {
      newErrors.tableId = "Please select a table.";
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!formData.date || !dateRegex.test(formData.date)) {
      newErrors.date = "Invalid date format. Use YYYY-MM-DD.";
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    try {
      await axios.post("http://localhost:5000/api/reservations", formData);
      alert("Reservation created successfully!");
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        tableId: "",
        date: "",
        timeSlot: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create reservation.");
    }
  };

  // ✅ Handle Cancel (Reset Form)
  const handleCancel = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      tableId: "",
      date: "",
      timeSlot: "",
    });
    setErrors({});
  };

  return (
    <div className="reservation-form"> 
    <div className="reservation-container">
      <h2>Reserve a Table</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        {/* Customer Name */}
        <label>Name:</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className={errors.customerName ? "error-input" : ""}
        />
        {errors.customerName && <span className="error-text">{errors.customerName}</span>}

        {/* Email */}
        <label>Email:</label>
        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          className={errors.customerEmail ? "error-input" : ""}
        />
        {errors.customerEmail && <span className="error-text">{errors.customerEmail}</span>}

        {/* Phone */}
        <label>Phone:</label>
        <input
          type="text"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          className={errors.customerPhone ? "error-input" : ""}
        />
        {errors.customerPhone && <span className="error-text">{errors.customerPhone}</span>}

        {/* Table Selection */}
        <label>Select Table:</label>
        <select name="tableId" value={formData.tableId} onChange={handleChange}>
          <option value="">-- Select a Table --</option>
          {tables.map((table) => (
            <option key={table._id} value={table._id}>
              Table {table.number} (Seats: {table.capacity})
            </option>
          ))}
        </select>
        {errors.tableId && <span className="error-text">{errors.tableId}</span>}

        {/* Date */}
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
        {errors.date && <span className="error-text">{errors.date}</span>}

        {/* Time Slot */}
        <label>Time Slot:</label>
        <select name="timeSlot" value={formData.timeSlot} onChange={handleChange}>
          <option value="">-- Select a Time Slot --</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {errors.timeSlot && <span className="error-text">{errors.timeSlot}</span>}

        {/* Buttons */}
        <button type="submit" className="submit-btn" onClick={() => navigate('/reservations')}>Submit</button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  </div>
  );
};

export default ReservationForm;
