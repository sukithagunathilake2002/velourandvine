import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/BasketPage.css";

const BasketPage = () => {
  const { user } = useContext(AuthContext);
  const [basketItems, setBasketItems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const axiosWithAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  useEffect(() => {
    if (!decodedToken?.id) {
      alert("⚠️ Please log in to view your basket!");
      navigate("/login");
      return;
    }
    const basketKey = `basket_${decodedToken.id}`;
    const storedBasket = JSON.parse(localStorage.getItem(basketKey) || "[]");
    setBasketItems(storedBasket);
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

  const removeFromBasket = (itemId) => {
    const basketKey = `basket_${decodedToken.id}`;
    const updatedBasket = basketItems.filter((item) => item.menuItemId !== itemId);
    setBasketItems(updatedBasket);
    localStorage.setItem(basketKey, JSON.stringify(updatedBasket));
    alert("Item removed from basket!");
  };

  return (
    <div className="basket-bg">
    <div className="basket-page">
      <h1>Your Basket</h1>
      {!decodedToken?.id && <p>Please log in to see your basket!</p>}
      {basketItems.length === 0 ? (
        <p>No items in basket yet.</p>
      ) : (
        basketItems.map((item) => (
          <div key={item.menuItemId} className="basket-item">
            <p>
              <strong>{item.name}</strong> — ${item.price.toFixed(2)}
            </p>
            <p>Quantity: {item.quantity}</p>
            <p>Special Instructions: {item.specialInstructions || "None"}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
              Add to Cart
            </button>
            <button className="remove-btn" onClick={() => removeFromBasket(item.menuItemId)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default BasketPage;