import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/OrderPage.css";

const PaymentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [cart, setCart] = useState([]);
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
      }
    }
    fetchCart();
  }, [user]);

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const isValidCardNumber = (number) => {
    const digits = number.replace(/\s/g, "").split("").map(Number);
    if (digits.length !== 16) return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(" ") || digits;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setValue("cardNumber", formatted);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    if (cart.length === 0) {
      alert("⚠️ Your cart is empty!");
      return;
    }
    if (!token || !decodedToken?.id) {
      alert("⚠️ Please log in to place an order!");
      return;
    }

    setIsSubmitting(true);
    const orderData = {
      customerId: decodedToken.id,
      items: cart,
      paymentMethod: "Card",
      totalPrice: parseFloat(calculateTotalPrice()),
      cardDetails: {
        cardName: data.cardName,
        cardNumber: data.cardNumber.replace(/\s/g, ""),
        expiry: data.expiry,
        cvv: data.cvv,
      },
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
    <div className="payment-bg">
    <div className="order-page">
      <h1>Payment Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-section">
          <label>Cardholder Name</label>
          <input
            type="text"
            {...register("cardName", { required: "Cardholder name is required" })}
            placeholder="Name on card"
          />
          {errors.cardName && <p className="error-message">{errors.cardName.message}</p>}

          <label>Card Number</label>
          <input
            type="text"
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
                message: "Card number must be 16 digits (e.g., 1234 4323 4321 2343)",
              },
              validate: (value) => isValidCardNumber(value) || "Invalid card number",
            })}
            onChange={handleCardNumberChange}
            placeholder="1234 4323 4321 2343"
            maxLength={19}
          />
          {errors.cardNumber && <p className="error-message">{errors.cardNumber.message}</p>}

          <label>Expiration Date</label>
          <input
            type="month"
            {...register("expiry", {
              required: "Expiry date is required",
              validate: (value) => {
                const [year, month] = value.split("-");
                const expiryDate = new Date(year, month - 1);
                const today = new Date();
                return expiryDate > today || "Card is expired";
              },
            })}
          />
          {errors.expiry && <p className="error-message">{errors.expiry.message}</p>}

          <label>CVV</label>
          <input
            type="password"
            {...register("cvv", {
              required: "CVV is required",
              pattern: { value: /^\d{3,4}$/, message: "CVV must be 3 or 4 digits" },
            })}
            placeholder="123"
            maxLength={4}
          />
          {errors.cvv && <p className="error-message">{errors.cvv.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      <div className="order-status-section">
        <button onClick={checkOrderStatus}>Check Order Status</button>
      </div>
    </div>
    </div>
  );
};

export default PaymentPage;