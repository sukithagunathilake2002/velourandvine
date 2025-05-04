import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/OrderStatusPage.css";

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const axiosWithAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const res = await axiosWithAuth.get(`http://localhost:5000/orders/status/${orderId}`);
        setStatus(res.data.status);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order status:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load status");
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderStatus();
    }
  }, [orderId]);

  const goBack = () => navigate(-1);

  return (
    <div className="order-status-page">
      <div className="status-box">
        {loading ? (
          <div className="spinner"></div>
        ) : error ? (
          <>
            <p className="error">{error}</p>
            <button onClick={goBack}>Back</button>
          </>
        ) : (
          <>
            <div className="status-message">
              Your order is {status?.toLowerCase()}...
              <div className="spinner"></div>
            </div>
            <button onClick={goBack}>Back</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;
