import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useForm } from "react-hook-form";
import "../styles/AddTable.css";

const API_URL = "http://localhost:5000/api/tables";

const AddTable = () => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange" // ✅ Enable real-time validation
  });

  // ✅ Submit Form Data
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      setMessage({ type: "success", text: response.data.message });
      reset(); // Clear form
      setTimeout(() => navigate('/tables'), 1500); // Redirect after 1.5s
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Server error",
      });
    }
  };

  return (
    <div className="add-table-container">
      <h2>Add New Table</h2>

      {/* Display Success or Error Messages */}
      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="table-form">
        {/* Table Number */}
        <label>Table Number</label>
        <input
          type="number"
          {...register("number", {
            required: "Table number is required",
            min: { value: 1, message: "Table number must be at least 1" },
          })}
        />
        {errors.number && <p className="error">{errors.number.message}</p>}

        {/* Capacity */}
        <label>Capacity</label>
        <input
          type="number"
          {...register("capacity", {
            required: "Capacity is required",
            min: { value: 1, message: "Capacity must be at least 1" },
            max: { value: 20, message: "Capacity cannot exceed 20" },
          })}
        />
        {errors.capacity && <p className="error">{errors.capacity.message}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={!isValid}>Add Table</button>
      </form>
    </div>
  );
};

export default AddTable;
