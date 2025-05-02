import axios from "axios";

const BASE_URL = "http://localhost:5000/api/menus/all";
const MENU_BASE = "http://localhost:5000/api/menus";
const PROMO_URL = "http://localhost:5000/api/promotions";

export const fetchMenus = (params = {}) =>
  axios.get(BASE_URL, { params });

export const deleteMenu = (id) =>
  axios.delete(`${MENU_BASE}/delete/${id}`);

// ✅ Update (add/edit) promotion
export const updatePromotion = (id, data) =>
  axios.put(`${PROMO_URL}/${id}`, data);

// ✅ Remove promotion (corrected)
export const removePromotion = (id) =>
  axios.put(`${MENU_BASE}/remove-promotion/${id}`);
