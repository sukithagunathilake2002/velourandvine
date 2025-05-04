import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/FavoritesPage.css";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const axiosWithAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  useEffect(() => {
    if (!decodedToken?.id) {
      alert("⚠️ Please log in to view favorites!");
      navigate("/login");
      return;
    }
    const favoritesKey = `favorites_${decodedToken.id}`;
    const storedFavorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    setFavorites(storedFavorites);
  }, [user, navigate]);

  const addToCart = async (item) => {
    const userId = decodedToken?.id;
    if (!userId) {
      alert("⚠️ Please log in to add to cart!");
      return;
    }

    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const updatedCart = cart.some((cartItem) => cartItem.menuItemId === item.menuItemId)
      ? cart.map((cartItem) => (cartItem.menuItemId === item.menuItemId ? { ...cartItem, ...item } : cartItem))
      : [...cart, item];
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    try {
      await axiosWithAuth.post(`http://localhost:5000/cart/${userId}`, { items: updatedCart });
      alert(`${item.name} added to cart!`);
      navigate("/cart"); // Navigate to CartPage
    } catch (err) {
      console.error("Error syncing cart to server:", err.response?.data || err.message);
      alert(`${item.name} added to cart locally!`);
      navigate("/cart"); // Navigate to CartPage even on error
    }
  };

  const removeFromFavorites = (itemId) => {
    const favoritesKey = `favorites_${decodedToken.id}`;
    const updatedFavorites = favorites.filter((item) => item.menuItemId !== itemId);
    setFavorites(updatedFavorites);
    localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    alert("Item removed from favorites!");
  };

  return (
    <div className="favourite-bg">
    <div className="favorites-page">
      <h1>Your Favorites</h1>
      {!decodedToken?.id && <p>Please log in to see your favorites!</p>}
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favorites.map((item) => (
          <div key={item.menuItemId} className="favorite-item">
            <p>
              <strong>{item.name}</strong> — ${item.price.toFixed(2)}
            </p>
            <p>Quantity: {item.quantity}</p>
            <p>Special Instructions: {item.specialInstructions || "None"}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
            <button onClick={() => removeFromFavorites(item.menuItemId)}>Remove</button>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default FavoritesPage;