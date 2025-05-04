import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ReservationForm.css";

const API_URL = "http://localhost:5000/api/reservations";
const TABLES_URL = "http://localhost:5000/api/tables";
const USER_URL = "http://localhost:5000/api/users";
const CHECK_AVAILABILITY_URL = "http://localhost:5000/api/reservations/check-availability";

const ReservationForm = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [tableId, setTableId] = useState("");
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(TABLES_URL)
      .then(res => setTables(res.data))
      .catch(err => console.error("Error fetching tables:", err));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(USER_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/reserve");
      }
    };

    fetchUser();
  }, [navigate]);

  const validateField = (name, value) => {
    const today = new Date().toISOString().split("T")[0];
    let error = "";

    switch (name) {
      case "date":
        if (!value) error = "Date is required.";
        else if (value < today) error = "Date must be today or later.";
        break;
      case "timeSlot":
        if (!value) error = "Please select a time slot.";
        break;
      case "tableId":
        if (!value) error = "Please select a table.";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === "";
  };

  const checkTableAvailability = async () => {
    try {
      const res = await axios.get(CHECK_AVAILABILITY_URL, {
        params: { tableId, date, timeSlot }
      });
      return res.data.isReserved;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") setDate(value);
    if (name === "timeSlot") setTimeSlot(value);
    if (name === "tableId") setTableId(value);
    validateField(name, value);
  };

  const validateAll = () => {
    const isDateValid = validateField("date", date);
    const isTimeValid = validateField("timeSlot", timeSlot);
    const isTableValid = validateField("tableId", tableId);
    return isDateValid && isTimeValid && isTableValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateAll()) return;

    const isReserved = await checkTableAvailability();
    if (isReserved) {
      setErrors(prev => ({
        ...prev,
        tableId: `Table is already reserved for ${timeSlot} on ${date}. Please choose a different time or table.`,
      }));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API_URL,
        { tableId, date, timeSlot },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      navigate("/my-reservation");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create reservation. Please try again."
      );
    }
  };

  const handleCancel = () => {
    setDate("");
    setTimeSlot("");
    setTableId("");
    setErrors({});
    setMessage("");
    navigate("/reserve");
  };

  return (
  <div className="reservation-page-bg">
    <div className="reservation-form-container">
      <h2>Make a Reservation</h2>

      {/* ✅ Personalized welcome message */}
      {user && <p className="welcome-message">Welcome, {user.name}!</p>}

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="reservation-form">


        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={handleChange}
          className={errors.date ? "error-input" : ""}
        />
        {errors.date && <p className="error">{errors.date}</p>}

        <label>Time Slot:</label>
        <select
          name="timeSlot"
          value={timeSlot}
          onChange={handleChange}
          className={errors.timeSlot ? "error-input" : ""}
        >
          <option value="">Select a Time Slot</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="6:00 PM">6:00 PM</option>
          <option value="9:00 PM">9:00 PM</option>
        </select>
        {errors.timeSlot && <p className="error">{errors.timeSlot}</p>}

        <label>Table:</label>
        <select
          name="tableId"
          value={tableId}
          onChange={handleChange}
          className={errors.tableId ? "error-input" : ""}
        >
          <option value="">Select a Table</option>
          {tables.map((table) => (
            <option key={table._id} value={table._id}>
              Table {table.number} (Seats: {table.capacity})
            </option>
          ))}
        </select>
        {errors.tableId && <p className="error">{errors.tableId}</p>}

        <div className="button-group">
          <button type="submit">Reserve Now</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ReservationForm;
