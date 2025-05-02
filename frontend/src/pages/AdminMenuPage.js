import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import {
  fetchMenus,
  deleteMenu,
  updatePromotion,
  removePromotion,
} from "../api/menuApi";

import { generateMenuPdf } from "../utils/menuPdfExporter";
import { generatePromotionReportPdf } from "../utils/promotionPdfExporter";
import MenuTable from "../components/MenuTable";
import MenuFormModal from "../components/MenuFormModal";
import PromotionModal from "../components/PromotionModal";
import CategoryFilter from "../components/CategoryFilter";

const AdminMenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [category, setCategory] = useState("");
  const [onlyPromoted, setOnlyPromoted] = useState(false);

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

  const [promoSuccess, setPromoSuccess] = useState("");
  const [promoError, setPromoError] = useState("");
  const [viewOnlyPromo, setViewOnlyPromo] = useState(false);
  const [isEditingPromo, setIsEditingPromo] = useState(false); // 👈 new state

  const loadMenus = useCallback(async () => {
    const res = await fetchMenus({ category });
    setMenus(res.data);
  }, [category]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this menu?")) {
      await deleteMenu(id);
      loadMenus();
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      image: null,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (menu) => {
    setEditData(menu);
    setFormData({
      name: menu.name,
      category: menu.category,
      description: menu.description,
      price: menu.price,
      image: null,
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

      if (editData) {
        await axios.put(url, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(url, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsFormOpen(false);
      setEditData(null);
      loadMenus();
    } catch (err) {
      alert("Error saving menu: " + err.message);
    }
  };

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePromotion(promoData._id, promoForm);
      setPromoSuccess("✅ Promotion updated successfully!");
      setPromoError("");
      setTimeout(() => setPromoSuccess(""), 3000);
      setPromoData(null);
      setViewOnlyPromo(false);
      setIsEditingPromo(false);
      loadMenus();
    } catch (error) {
      setPromoError("❌ Failed to update promotion.");
      setPromoSuccess("");
    }
  };

  const handleDeletePromotion = async () => {
    try {
      await removePromotion(promoData._id);
      setPromoSuccess("✅ Promotion removed successfully!");
      setPromoError("");
      setTimeout(() => setPromoSuccess(""), 3000);
      setPromoData(null);
      setViewOnlyPromo(false);
      setIsEditingPromo(false);
      loadMenus();
    } catch (error) {
      setPromoError("❌ Failed to remove promotion.");
      setPromoSuccess("");
    }
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




  const filteredMenus = onlyPromoted
    ? menus.filter((menu) => menu.promotion?.discountRate > 0)
    : menus;

  return (
    <div style={{ padding: "30px" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Admin Menu Management
      </h1>

      <button
        onClick={() => generateMenuPdf(menus, category || "All Categories")}
        style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white", marginLeft: "10px" }}
      >
        📄 Export PDF
      </button>
      
      
      <button
        onClick={async () => {
          const res = await axios.get("http://localhost:5000/api/menus/promotions/report");
          generatePromotionReportPdf(res.data);
        }}
        style={{ marginTop: "10px" }}
      >
        🖨️ Export Promotions PDF
      </button>

      

      <div style={{ margin: "15px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={onlyPromoted}
            onChange={() => setOnlyPromoted(!onlyPromoted)}
          />{" "}
          Show Only Promotion Items
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <CategoryFilter category={category} setCategory={setCategory} inputStyle={inputStyle} />
        <button
          onClick={handleAdd}
          style={{ ...buttonStyle, backgroundColor: "#007bff", color: "white" }}
        >
          + Add Menu
        </button>
      </div>

      <MenuTable
        menus={filteredMenus}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setPromoData={(menu) => {
          setPromoData(menu);
          setPromoForm({
            discountRate: menu.promotion?.discountRate || "",
            startDate: menu.promotion?.startDate?.substring(0, 10) || "",
            endDate: menu.promotion?.endDate?.substring(0, 10) || "",
          });
          setViewOnlyPromo(true);
          setIsEditingPromo(false);
        }}
        setPromoForm={setPromoForm}
        setViewOnlyPromo={setViewOnlyPromo}
        buttonStyle={buttonStyle}
      />

      {isFormOpen && (
        <MenuFormModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setIsFormOpen(false);
            setEditData(null);
          }}
          onSubmit={handleSubmitForm}
          inputStyle={inputStyle}
          buttonStyle={buttonStyle}
          editData={editData}
        />
      )}

      {promoData && (
        <PromotionModal
          promoData={promoData}
          promoForm={promoForm}
          setPromoForm={setPromoForm}
          onClose={() => {
            setPromoData(null);
            setViewOnlyPromo(false);
            setIsEditingPromo(false);
          }}
          onSubmit={handlePromoSubmit}
          handleDeletePromotion={handleDeletePromotion}
          inputStyle={inputStyle}
          buttonStyle={buttonStyle}
          successMessage={promoSuccess}
          errorMessage={promoError}
          isViewOnly={viewOnlyPromo}
          isEditingPromo={isEditingPromo}
          setIsEditingPromo={setIsEditingPromo}
        />
      )}
    </div>
  );
};

export default AdminMenuPage;
