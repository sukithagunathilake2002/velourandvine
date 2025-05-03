import React from "react";

const MenuFormModal = ({ formData, setFormData, onClose, onSubmit, inputStyle, buttonStyle, editData }) => (
  <div style={modalOverlayStyle}>
    <div style={modalBoxStyle}>
      <span style={closeIconStyle} onClick={onClose}>&times;</span>
      <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
        {editData ? "Edit Menu" : "Add Menu"}
      </h2>
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Menu Name" style={inputStyle} required />
        <select name="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={inputStyle} required>
          <option value="">Select Category</option>
          <option>Appetizers</option>
          <option>Main Courses</option>
          <option>Salads</option>
          <option>Desserts</option>
          <option>Wine Selection</option>
          <option>Signature Cocktails</option>
        </select>
        <input name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" style={inputStyle} />
        <input name="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" style={inputStyle} required />
        <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} style={inputStyle} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
          <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#777", color: "white" }}>Cancel</button>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: "#fdd835", color: "#000" }}>
            {editData ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

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

export default MenuFormModal;
