import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/EditOrderPage.css'; // Make sure this is imported

const EditOrderPage = () => {
  const { orderId } = useParams(); // Get the order ID from URL params
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [allOrders, setAllOrders] = useState([]); // To store all orders for sequential indexing

  // Fetch all orders to get the order with the specific orderId
  useEffect(() => {
    axios.get("http://localhost:5000/orders/all")
      .then(res => {
        setAllOrders(res.data); // Store all orders for index calculation
        const foundOrder = res.data.find(o => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
          setStatus(foundOrder.status);
          setPrice(foundOrder.totalPrice); // Set the initial price from the order
        }
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      });
  }, [orderId]);

  // Get the order index (1-based index)
  const getOrderIndex = () => {
    if (!allOrders || !order) return 0;
    return allOrders.findIndex((orderItem) => orderItem._id === orderId) + 1;
  };

  // Format the price to show only two decimal places
  const formatPrice = (price) => {
    return price.toFixed(2); // Limits the price to two decimal places
  };

  // Handle updating the order status and price
  const handleUpdate = async () => {
    try {
      // Update both the status and price of the order
      await axios.put(`http://localhost:5000/orders/update-status/${orderId}`, {
        status,
        totalPrice: price, // Include the updated price
      });
      alert("✅ Order updated successfully");
      navigate("/staff/orders"); // Navigate to the staff orders page after updating
    } catch (err) {
      console.error("❌ Failed to update order", err);
      alert("Update failed");
    }
  };

  // If the order is still loading, display a loading message
  if (!order) return <p>Loading order...</p>;

  return (
    <div className="edit-order-page"> {/* Unique wrapper class */}
      <h1>Edit Order</h1>

      {/* Display the sequential order index */}
      <p><strong>Order ID :</strong>  {getOrderIndex()}</p> {/* Display Order index as "Order 1", "Order 2", etc. */}

      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="Verifying">Verifying</option>
        <option value="Preparing">Preparing</option>
        <option value="Ready">Ready</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <br /><br />

      <label>Price:</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />
      <button onClick={handleUpdate}>Update Order</button>
    </div>
  );
};

export default EditOrderPage;
