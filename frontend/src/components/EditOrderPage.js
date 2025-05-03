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
  const [loading, setLoading] = useState(false); // Add loading state for update
  const [error, setError] = useState(null); // Add error state

  // Fetch all orders to get the order with the specific orderId
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders/all");
        setAllOrders(res.data); // Store all orders for index calculation
        const foundOrder = res.data.find(o => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
          setStatus(foundOrder.status);
          setPrice(foundOrder.totalPrice.toString()); // Convert to string for input
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      }
    };

    fetchOrders();
  }, [orderId]);

  // Get the order index (1-based index)
  const getOrderIndex = () => {
    if (!allOrders || !order) return 0;
    return allOrders.findIndex((orderItem) => orderItem._id === orderId) + 1;
  };

  // Format the price to show only two decimal places
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2); // Ensure number and limit to two decimal places
  };

  // Handle updating the order status, price, and special instructions
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Convert price to a number, fallback to original if invalid
      const updatedPrice = parseFloat(price) || order.totalPrice;

      // Ensure items array maintains all required fields
      const updatedItems = order.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || "",
        price: item.price,
        subtotal: item.subtotal
      }));

      // Send update request to the new endpoint
      const response = await axios.put(`http://localhost:5000/orders/update/${orderId}`, {
        status,
        totalPrice: updatedPrice,
        items: updatedItems,
      });

      alert("✅ Order updated successfully");
      navigate("/staff/orders");
    } catch (err) {
      console.error("❌ Failed to update order", err);
      setError(err.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  // Handle change in special instructions
  const handleSpecialInstructionsChange = (index, value) => {
    const updatedItems = [...order.items];
    updatedItems[index].specialInstructions = value || ""; // Ensure empty string if no value
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: updatedItems,
    }));
  };

  // If the order is still loading, display a loading message
  if (!order && !error) return <p>Loading order...</p>;

  // If there's an error loading the order
  if (error && !order) return <p>Error: {error}</p>;

  return (
    <div className="edit-order-page">
      <h1>Edit Order</h1>

      {/* Display the sequential order index */}
      <p><strong>Order ID:</strong> {getOrderIndex()}</p>

      {/* Display any update errors */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <label>Status:</label>
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        disabled={loading}
      >
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
        disabled={loading}
      />

      <br /><br />

      {/* Display order items and allow editing of special instructions */}
      <h2>Order Items</h2>
      {order.items.map((item, index) => (
        <div key={item.menuItemId} className="order-item">
          <p><strong>{item.name} - ${formatPrice(item.price)}</strong></p>
          <label>Special Instructions:</label>
          <input
            type="text"
            value={item.specialInstructions || ""}
            onChange={(e) => handleSpecialInstructionsChange(index, e.target.value)}
            placeholder="Enter special instructions"
            disabled={loading}
          />
        </div>
      ))}

      <br /><br />
      <button 
        onClick={handleUpdate} 
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Order"}
      </button>
    </div>
  );
};

export default EditOrderPage;