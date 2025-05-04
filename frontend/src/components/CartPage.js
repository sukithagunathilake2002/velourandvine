import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/CartPage.css';



const CartPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const axiosWithAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const fetchCart = () => {
    const userId = decodedToken?.id;
    if (userId) {
      axiosWithAuth
        .get(`http://localhost:5000/cart/${userId}`)
        .then((res) => {
          const serverCart = res.data.items || [];
          const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
          const mergedCart = [
            ...serverCart.filter((sItem) => !localCart.some((lItem) => lItem.menuItemId === sItem.menuItemId)),
            ...localCart,
          ];
          setCart(mergedCart);
          saveCart(mergedCart);
        })
        .catch((err) => {
          console.error("Error fetching cart:", err.response?.data || err.message);
          const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
          setCart(localCart);
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart_guest") || "[]");
      setCart(localCart);
    }
  };

  useEffect(() => {
    const userId = decodedToken?.id;
    if (userId) {
      const storedOrderId = localStorage.getItem(`lastOrderId_${userId}`);
      if (storedOrderId) {
        setOrderId(storedOrderId);
      } else {
        axiosWithAuth
          .get(`http://localhost:5000/orders/all?customerId=${userId}`)
          .then((res) => {
            const orders = res.data;
            if (orders.length > 0) {
              const latestOrder = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
              setOrderId(latestOrder._id);
              localStorage.setItem(`lastOrderId_${userId}`, latestOrder._id);
            }
          })
          .catch((err) => console.error("Error fetching latest order:", err.response?.data || err.message));
      }
    }

    fetchCart();
  }, [user]);

  const saveCart = async (updatedCart) => {
    const userId = decodedToken?.id;
    if (userId) {
      try {
        await axiosWithAuth.post(`http://localhost:5000/cart/${userId}`, { items: updatedCart });
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      } catch (err) {
        console.error("Error saving cart to server:", err.response?.data || err.message);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      }
    } else {
      localStorage.setItem("cart_guest", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.menuItemId !== itemId);
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const updateCartItem = (itemId, field, value) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.menuItemId === itemId
          ? { ...item, [field]: field === "quantity" ? parseInt(value) || 1 : value }
          : item
      );
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handlePaymentChange = (e) => {
    const newPaymentType = e.target.value;
    setPaymentType(newPaymentType);
  };

  const submitOrder = async () => {
    if (isSubmitting) return;
    if (cart.length === 0) {
      alert("⚠️ Your cart is empty!");
      return;
    }
    if (!paymentType) {
      alert("⚠️ Please select a payment method!");
      return;
    }
    if (!token || !decodedToken?.id) {
      alert("⚠️ Please log in to place an order!");
      return;
    }

    if (paymentType === "Card") {
      navigate("/payment"); // Navigate to PaymentPage for card details
      return;
    }

    setIsSubmitting(true);
    const orderData = {
      customerId: decodedToken.id,
      items: cart,
      paymentMethod: paymentType,
      totalPrice: parseFloat(calculateTotalPrice()),
    };

    try {
      const orderResponse = await axiosWithAuth.post("http://localhost:5000/orders/create", orderData);
      const newOrderId = orderResponse.data.order._id;
      setOrderId(newOrderId);
      localStorage.setItem(`lastOrderId_${decodedToken.id}`, newOrderId);
      alert("✅ Order placed successfully!");
      setCart([]);
      if (decodedToken?.id) {
        await axiosWithAuth.post(`http://localhost:5000/cart/${decodedToken.id}`, { items: [] });
      } else {
        localStorage.setItem("cart_guest", "[]");
      }
      setPaymentType("");
      navigate("/order-status/" + newOrderId);
    } catch (err) {
      console.error("❌ Failed to place order:", err.response?.status, err.response?.data || err.message);
      alert("Failed to place order: " + (err.response?.data?.message || JSON.stringify(err.response?.data) || "Something went wrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkOrderStatus = () => {
    if (!orderId) {
      alert("⚠️ Place an order first!");
      return;
    }
    navigate(`/order-status/${orderId}`);
  };

  return (
    <div className="cart-bg">
    <div className="order-page">
      <h1>Your Cart</h1>
      <div className="cart-section">
        {cart.length === 0 ? (
          <p>No items in cart yet.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.menuItemId} className="cart-item">
                <p>
                  <strong>{item.name}</strong> — ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
                <label>Quantity:</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.menuItemId, "quantity", e.target.value)}
                />
                <label>Special Instructions:</label>
                <input
                  type="text"
                  value={item.specialInstructions}
                  onChange={(e) => updateCartItem(item.menuItemId, "specialInstructions", e.target.value)}
                  placeholder="Any notes?"
                />
                <button type="button" onClick={() => removeFromCart(item.menuItemId)}>
                  Remove
                </button>
              </div>
            ))}
            <div className="cart-total">
              <h3>Total Price: ${calculateTotalPrice()}</h3>
            </div>
          </>
        )}

        <label>Payment Method:</label>
        <select onChange={handlePaymentChange} value={paymentType}>
          <option value="">Select</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>

        <button onClick={submitOrder} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : paymentType === "Card" ? "Proceed to Payment" : "Place Order"}
        </button>
      </div>

      <div className="order-status-section">
        <button onClick={checkOrderStatus}>Check Order Status</button>
      </div>
    </div>
    </div>
  );
};

export default CartPage;