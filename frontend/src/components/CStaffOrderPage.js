import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import
import '../styles/CStaffOrderPage.css';
import io from "socket.io-client"; // Import Socket.IO client




const StaffOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const socket = io("http://localhost:5000");

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
    return date.toLocaleString();
  };

  // Listen for real-time updates
  useEffect(() => {
    fetchOrders();
    socket.on("newOrder", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  // Handle deleting an order
  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/orders/delete/${orderId}`);
      alert("✅ Order deleted");
      fetchOrders();
    } catch (err) {
      console.error("❌ Error deleting order", err);
      alert("Failed to delete order");
    }
  };

  // Handle editing an order
  const handleEdit = (orderId) => {
    navigate(`/staff/orders/edit/${orderId}`);
  };

  // Generate PDF report
  const generateReport = () => {
    const doc = new jsPDF();

    doc.text("Order Report", 14, 15);

    const tableColumn = ["#", "Status", "Total", "Payment", "Date & Time", "Special Instructions"];
    const tableRows = [];

    orders.forEach((order, index) => {
      const instructionText = order.items
        .map((item) => `${item.name}: ${item.specialInstructions || "None"}`)
        .join("\n");

      tableRows.push([
        index + 1,
        order.status,
        `$${order.totalPrice.toFixed(2)}`,
        `${order.paymentMethod} (${order.paymentStatus})`,
        formatDateTime(order.createdAt),
        instructionText,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("order_report.pdf");
  };

  return (
    <div className="order-page">
      <h1 className="page-header">📋 All Orders</h1>

      <button className="report-btn" onClick={generateReport}>
        📄 Generate PDF Report
      </button>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date & Time</th>
              <th>Special Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.status}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{order.paymentMethod} ({order.paymentStatus})</td>
                <td>{formatDateTime(order.createdAt)}</td>
                <td>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      <strong>{item.name}:</strong> {item.specialInstructions || "None"}
                    </div>
                  ))}
                </td>
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
