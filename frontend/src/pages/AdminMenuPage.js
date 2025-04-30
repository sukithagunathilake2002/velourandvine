import React, { useEffect, useState } from "react";
import {
  fetchMenus,
  deleteMenu,
  updatePromotion,
} from "../api/menuApi";
import axios from "axios";

const AdminMenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: null,
  });

  const [promoData, setPromoData] = useState(null);
  const [promoForm, setPromoForm] = useState({
    discountRate: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadMenus();
  }, [category]);

  const loadMenus = async () => {
    const res = await fetchMenus({ category });
    setMenus(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this menu?")) {
      await deleteMenu(id);
      loadMenus();
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormData({ name: "", category: "", description: "", price: "", image: null });
    setIsFormOpen(true);
  };

  const handleEdit = (menu) => {
    setEditData(menu);
    setFormData({
      name: menu.name,
      category: menu.category,
      description: menu.description,
      price: menu.price,
      image: null, // user will re-upload if needed
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("description", formData.description);
      form.append("price", formData.price);
      if (formData.image) {
        form.append("image", formData.image);
      }
      const url = editData
      ? `http://localhost:5000/api/menus/update/${editData._id}`
      : "http://localhost:5000/api/menus/add";
    

      const method = editData ? axios.put : axios.post;

      await method(url, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsFormOpen(false);
      setEditData(null);
      loadMenus();
    } catch (err) {
      alert("Error saving menu: " + err.message);
    }
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    await updatePromotion(promoData._id, promoForm);
    setPromoData(null);
    loadMenus();
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

  const inputStyle = {
    padding: "12px",
    width: "100%",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outlineColor: "#fdd835",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <div style={{ padding: "30px" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Admin Menu Management</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="">All Categories</option>
          <option>Appetizers</option>
          <option>Main Courses</option>
          <option>Salads</option>
          <option>Desserts</option>
          <option>Wine Selection</option>
          <option>Signature Cocktails</option>
        </select>

        <button onClick={handleAdd} style={{ ...buttonStyle, backgroundColor: "#007bff", color: "white" }}>
          + Add Menu
        </button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f9f9f9" }}>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actual Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu._id}>
              <td>{menu.name}</td>
              <td>{menu.category}</td>
              <td>Rs. {menu.price}</td>
              <td>Rs. {menu.actualPrice}</td>
              <td>
                <button onClick={() => {
                  setPromoData(menu);
                  setPromoForm({
                    discountRate: menu.promotion?.discountRate || "",
                    startDate: menu.promotion?.startDate?.substring(0, 10) || "",
                    endDate: menu.promotion?.endDate?.substring(0, 10) || "",
                  });
                }} style={{ ...buttonStyle, backgroundColor: "orange", marginRight: "5px" }}>Promotion</button>
                <button onClick={() => handleEdit(menu)} style={{ ...buttonStyle, backgroundColor: "green", color: "white", marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDelete(menu._id)} style={{ ...buttonStyle, backgroundColor: "red", color: "white" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <span style={closeIconStyle} onClick={() => { setIsFormOpen(false); setEditData(null); }}>&times;</span>
            <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>{editData ? "Edit Menu" : "Add Menu"}</h2>
            <form onSubmit={handleSubmitForm} encType="multipart/form-data">
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
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ ...buttonStyle, backgroundColor: "#777", color: "white" }}>Cancel</button>
                <button type="submit" style={{ ...buttonStyle, backgroundColor: "#fdd835", color: "#000" }}>{editData ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {promoData && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <span style={closeIconStyle} onClick={() => setPromoData(null)}>&times;</span>
            <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
              Update Promotion for {promoData.name}
            </h2>
            <form onSubmit={handlePromoSubmit}>
              <input type="number" name="discountRate" value={promoForm.discountRate} onChange={(e) => setPromoForm({ ...promoForm, discountRate: e.target.value })} placeholder="Discount %" style={inputStyle} required />
              <input type="date" name="startDate" value={promoForm.startDate} onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })} style={inputStyle} />
              <input type="date" name="endDate" value={promoForm.endDate} onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })} style={inputStyle} />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setPromoData(null)} style={{ ...buttonStyle, backgroundColor: "#777", color: "white" }}>Cancel</button>
                <button type="submit" style={{ ...buttonStyle, backgroundColor: "#4caf50", color: "white" }}>Save Promotion</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;
