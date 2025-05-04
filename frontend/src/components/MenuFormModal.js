import React, { useState } from "react";

const MenuFormModal = ({ formData, setFormData, onClose, onSubmit, inputStyle, buttonStyle, editData }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Menu name is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    else if (parseFloat(formData.price) <= 0) newErrors.price = "Price must be a positive number.";
    if (!formData.image && !editData) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(e);
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalBoxStyle}>
        <span style={closeIconStyle} onClick={onClose}>&times;</span>
        <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {editData ? "Edit Menu" : "Add Menu"}
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          <div style={fieldStyle}>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Menu Name"
              style={inputStyle}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          <div style={fieldStyle}>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option>Appetizers</option>
              <option>Main Courses</option>
              <option>Salads</option>
              <option>Desserts</option>
              <option>Wine Selection</option>
              <option>Signature Cocktails</option>
            </select>
            {errors.category && <p style={errorStyle}>{errors.category}</p>}
          </div>

          <div style={fieldStyle}>
            <input
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              style={inputStyle}
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>

          <div style={fieldStyle}>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Price"
              style={inputStyle}
            />
            {errors.price && <p style={errorStyle}>{errors.price}</p>}
          </div>

          <div style={fieldStyle}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              style={inputStyle}
            />
            {errors.image && <p style={errorStyle}>{errors.image}</p>}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#777", color: "white" }}>
              Cancel
            </button>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: "#fdd835", color: "#000" }}>
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reused styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalBoxStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "30px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 25px 40px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.3s ease-in-out",
  position: "relative",
};

const closeIconStyle = {
  position: "absolute",
  top: "12px",
  right: "16px",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#888",
  cursor: "pointer",
};

const errorStyle = {
  color: "#d32f2f",
  fontSize: "12px",
  marginTop: "4px",
  marginBottom: "0",
  paddingLeft: "2px",
};

const fieldStyle = {
  marginBottom: "16px",
};

export default MenuFormModal;
