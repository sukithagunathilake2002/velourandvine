import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentOrder = () => {
  const [recentOrder, setRecentOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const customerId = "67cf2b4b0a03e56867b6b683"; // Replace with dynamic user ID later

  useEffect(() => {
    const fetchRecentOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recent-orders/${customerId}`);
        setRecentOrder(res.data);
        setShowModal(true);
      } catch (err) {
        console.error("No recent order or error occurred.");
      }
    };

    fetchRecentOrder();
  }, []);

  const modalOverlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: "25px 30px",
    borderRadius: "12px",
    maxWidth: "420px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)"
  };

  const headingStyle = {
    marginBottom: "12px",
    fontSize: "20px"
  };

  const buttonStyle = {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <div>
      <h2>Place Your Order</h2>

      {/* ✅ Dark Modal */}
      {showModal && recentOrder && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={headingStyle}>Welcome back!</h3>
            <p>You last ordered:</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {recentOrder.items.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <p>Would you like to order the same again or try something else?</p>
            <button style={buttonStyle} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrder;
