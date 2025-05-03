import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import Socket.IO client




const StaffOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const socket = io("http://localhost:5000"); // Connect to the server

  // Fetch all orders initially
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString(); // Format the date and time
  };

  // Listen for real-time updates (new orders)
  useEffect(() => {
    fetchOrders(); // Fetch orders when component mounts

    // Listen for new orders from the server
    socket.on("newOrder", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]); // Add new order to the top
    });

    return () => {
      socket.off("newOrder"); // Cleanup the socket listener when component unmounts
    };
  }, []);

  // Handle deleting an order
  const handleDelete = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/orders/delete/${orderId}`);
      alert("✅ Order deleted");
      fetchOrders(); // Refresh orders after deletion
    } catch (err) {
      console.error("❌ Error deleting order", err);
      alert("Failed to delete order");
    }
  };

  // Handle editing an order
  const handleEdit = (orderId) => {
    navigate(`/staff/orders/edit/${orderId}`);
  };

  return (
    <div className="order-page">
      <h1 className="page-header">📋 All Orders</h1>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th> {/* Order index */}
              <th>Status</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                {/* Display sequential order index */}
                <td>{index + 1}</td> {/* Order ID starts from 1 */}
                <td>{order.status}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.paymentMethod} ({order.paymentStatus})</td>
                <td>{formatDateTime(order.createdAt)}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(order._id)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffOrderPage;
