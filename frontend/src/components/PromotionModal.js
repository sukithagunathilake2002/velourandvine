import React from "react";

const PromotionModal = ({
  promoData,
  promoForm,
  setPromoForm,
  onClose,
  onSubmit,
  handleDeletePromotion,
  inputStyle,
  buttonStyle,
  successMessage,
  errorMessage,
  isViewOnly,
  isEditingPromo,
  setIsEditingPromo,
}) => {
  const actualPrice = (
    promoData.price - (promoData.price * promoForm.discountRate) / 100
  ).toFixed(2);

  return (
    <div style={modalOverlayStyle}>
      <div style={modalBoxStyle}>
        <span style={closeIconStyle} onClick={onClose}>
          &times;
        </span>

        <h2 style={modalTitle}>Promotion Details</h2>

        {successMessage && (
          <div style={successMessageStyle}>{successMessage}</div>
        )}
        {errorMessage && (
          <div style={errorMessageStyle}>{errorMessage}</div>
        )}

        {isViewOnly && !isEditingPromo ? (
          <>
            <p><strong>Menu Item:</strong> {promoData.name}</p>
            <p><strong>Original Price:</strong> Rs. {promoData.price}</p>
            <p><strong>Discount:</strong> {promoForm.discountRate}%</p>
            <p><strong>Actual Price:</strong> Rs. {actualPrice}</p>
            <p><strong>Start Date:</strong> {promoForm.startDate}</p>
            <p><strong>End Date:</strong> {promoForm.endDate}</p>

            <div style={buttonGroupStyle}>
              <button
                onClick={() => setIsEditingPromo(true)}
                className={buttonStyle}
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDeletePromotion}
                className={buttonStyle}
              >
                🗑️ Delete
              </button>
              <button
                onClick={onClose}
                className={buttonStyle}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <input
              type="number"
              name="discountRate"
              value={promoForm.discountRate}
              onChange={(e) => setPromoForm({ ...promoForm, discountRate: e.target.value })}
              placeholder="Discount %"
              className={inputStyle}
              required
            />
            <input
              type="date"
              name="startDate"
              value={promoForm.startDate}
              onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
              className={inputStyle}
              required
            />
            <input
              type="date"
              name="endDate"
              value={promoForm.endDate}
              onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
              className={inputStyle}
              required
            />
            <div style={buttonGroupStyle}>
              <button type="submit" className={buttonStyle}>💾 Save</button>
              <button type="button" onClick={handleDeletePromotion} className={buttonStyle}>🗑️ Delete</button>
              <button type="button" onClick={onClose} className={buttonStyle}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PromotionModal;

// --- Styles (Inline or move to external if needed) ---

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalBoxStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "30px",
  width: "100%",
  maxWidth: "500px",
  boxShadow: "0 25px 40px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.3s ease-in-out",
  position: "relative",
};

const closeIconStyle = {
  position: "absolute",
  top: "12px",
  right: "16px",
  fontSize: "20px",
  fontWeight: "bold",
  color: "#888",
  cursor: "pointer",
};

const modalTitle = {
  textAlign: "center",
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "20px",
};

const successMessageStyle = {
  color: "green",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center",
};

const errorMessageStyle = {
  color: "red",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "15px",
};
