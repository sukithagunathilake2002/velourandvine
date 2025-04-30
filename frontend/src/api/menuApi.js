import axios from "axios";

const BASE_URL = "http://localhost:5000/api/menus/all";

const PROMO_URL = "http://localhost:5000/api/promotions";

export const fetchMenus = (params = {}) =>
    axios.get(BASE_URL, { params }); 

export const deleteMenu = (id) => axios.delete(`http://localhost:5000/api/menus/delete/${id}`);


export const updatePromotion = (id, data) => {
    return axios.put(`http://localhost:5000/api/menus/${id}/promotion`, data);
  };
  

export const removePromotion = (id) =>
  axios.delete(`${PROMO_URL}/${id}`);
