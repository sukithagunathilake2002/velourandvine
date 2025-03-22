import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import '../styles/OrderPage.css';

const OrderPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    shouldUnregister: false
  });

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [paymentType, setPaymentType] = useState("");

  // Fetch menu items
  useEffect(() => {
    axios.get("http://localhost:5000/menu/all")
      .then(res => setMenuItems(res.data))
      .catch(err => console.error("Error fetching menu items:", err));
  }, []);

  // Handle checkbox toggle
  const handleCheck = (id, checked) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: checked ? { quantity: 1, specialInstructions: "" } : undefined
    }));
  };

  // Submit form
  const onSubmit = async (data) => {
    const items = Object.entries(selectedItems)
      .filter(([id, val]) => val)
      .map(([menuItemId]) => ({
        menuItemId,
        quantity: parseInt(data[`quantity_${menuItemId}`]) || 1,
        specialInstructions: data[`specialInstructions_${menuItemId}`] || "",
        price: menuItems.find(m => m._id === menuItemId)?.price,
      }));

    const orderData = {
      customerId: data.customerId || "",
      items,
      paymentMethod: data.paymentMethod,
      ...(data.paymentMethod === "Card" && {
        cardDetails: {
          cardName: data.cardName,
          cardNumber: data.cardNumber,
          expiry: data.expiry,
          cvv: data.cvv,
        }
      })
    };

    console.log("✅ Sending Order:", orderData);

    try {
      await axios.post("http://localhost:5000/orders/create", orderData);
      alert("✅ Order placed successfully!");
      reset();
      setSelectedItems({});
      setPaymentType("");
    } catch (err) {
      console.error("❌ Failed to place order", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="order-page">
      <h1>Create an Order</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("customerId")} value="67dd6bcf1e90c8c07c3b1267" />

        <h2>Menu Items</h2>
        {menuItems.map(item => (
          <div key={item._id} className="menu-item">
            <label>
              <input
                type="checkbox"
                onChange={e => handleCheck(item._id, e.target.checked)}
              />
              {item.name} — ${item.price.toFixed(2)}
            </label>

            {selectedItems[item._id] && (
              <>
                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    {...register(`quantity_${item._id}`)}
                  />
                </div>
                <div>
                  <label>Special Instructions:</label>
                  <input
                    type="text"
                    placeholder="Any notes?"
                    {...register(`specialInstructions_${item._id}`)}
                  />
                </div>
              </>
            )}
          </div>
        ))}

        <label>Payment Method:</label>
        <select
          {...register("paymentMethod", { required: true })}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>

        {/* Conditional Card Fields */}
        {paymentType === "Card" && (
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
                  value: /^\d{16}$/,
                  message: "Card number must be 16 digits"
                }
              })}
              placeholder="1234567812345678"
            />
            {errors.cardNumber && <p className="error-message">{errors.cardNumber.message}</p>}

            <label>Expiration Date</label>
            <input
              type="month"
              {...register("expiry", { required: "Expiry is required" })}
            />
            {errors.expiry && <p className="error-message">{errors.expiry.message}</p>}

            <label>CVV</label>
            <input
              type="password"
              {...register("cvv", {
                required: "CVV is required",
                pattern: {
                  value: /^\d{3}$/,
                  message: "CVV must be 3 digits"
                }
              })}
              placeholder="123"
            />
            {errors.cvv && <p className="error-message">{errors.cvv.message}</p>}
          </div>
        )}

        <br />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderPage;
