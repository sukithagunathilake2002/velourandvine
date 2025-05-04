import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditOrderPage.css";

const EditOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders/all");
        setAllOrders(res.data);
        const foundOrder = res.data.find((o) => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
          setStatus(foundOrder.status);
          setPrice(foundOrder.totalPrice.toString());
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

  const getOrderIndex = () => {
    if (!allOrders || !order) return 0;
    return allOrders.findIndex((o) => o._id === orderId) + 1;
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const handleUpdate = async () => {
    if (!order) return;
    setLoading(true);
    setError(null);
    try {
      const updatedPrice = parseFloat(price) || order.totalPrice;

      const updatedItems = order.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || "",
        price: item.price,
        subtotal: item.subtotal || item.price * item.quantity,
      }));

      await axios.put(`http://localhost:5000/orders/update/${orderId}`, {
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

  const handleSpecialInstructionsChange = (index, value) => {
    if (!order) return;
    const updatedItems = [...order.items];
    updatedItems[index].specialInstructions = value || "";
    setOrder((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  if (!order && !error) return <p>Loading order...</p>;
  if (error && !order) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="edit-order-page">
      <h1>Edit Order</h1>
      <p>
        <strong>Order Number:</strong> {getOrderIndex()}
      </p>

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

      <br />
      <br />

      <label>Price:</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={loading}
      />

      <br />
      <br />

      <h2>Order Items</h2>
      {order.items.map((item, index) => (
        <div key={item.menuItemId} className="order-item">
          <p>
            <strong>
              {item.name} - ${formatPrice(item.price)}
            </strong>
          </p>
          <label>Special Instructions:</label>
          <input
            type="text"
            value={item.specialInstructions || ""}
            onChange={(e) =>
              handleSpecialInstructionsChange(index, e.target.value)
            }
            placeholder="Enter special instructions"
            disabled={loading}
          />
        </div>
      ))}

      <br />
      <br />

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Order"}
      </button>
    </div>
  );
};

export default EditOrderPage;
