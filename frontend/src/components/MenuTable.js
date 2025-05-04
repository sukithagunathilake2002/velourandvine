import React from "react";

const MenuTable = ({
  menus,
  handleEdit,
  handleDelete,
  setPromoData,
  setPromoForm,
  setViewOnlyPromo,
  buttonStyle,
}) => (
  <div style={{ overflowX: "auto", border: "1px solid #ccc", borderRadius: "12px" }}>
    <table style={tableStyle}>
      <thead style={theadStyle}>
        <tr>
          <th style={thStyle}>Image</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Description</th>
          <th style={thStyle}>Price</th>
          <th style={thStyle}>Actual Price</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {menus.map((menu, index) => {
          const actualPrice =
            menu.promotion?.discountRate > 0 &&
            menu.promotion?.startDate &&
            menu.promotion?.endDate &&
            new Date() >= new Date(menu.promotion.startDate) &&
            new Date() <= new Date(menu.promotion.endDate)
              ? menu.price - (menu.price * menu.promotion.discountRate) / 100
              : menu.price;

          return (
            <tr key={menu._id} style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}>
              <td style={tdStyle}>
                {menu.image ? (
                  <img
                    src={`http://localhost:5000/${menu.image.replace(/\\/g, "/")}`}
                    alt={menu.name}
                    style={imageStyle}
                  />
                ) : (
                  <span style={{ color: "#888" }}>No Image</span>
                )}
              </td>
              <td style={tdStyle}>{menu.name}</td>
              <td style={tdStyle}>{menu.category}</td>
              <td style={tdStyle}>{menu.description || <span style={{ color: "#aaa" }}>No Description</span>}</td>
              <td style={tdStyle}>Rs. {menu.price}</td>
              <td style={tdStyle}>Rs. {actualPrice.toFixed(2)}</td>
              <td style={tdStyle}>
                <div style={actionButtonGroup}>
                  {menu.promotion?.discountRate > 0 ? (
                    <button
                      onClick={() => {
                        setPromoData(menu);
                        setPromoForm({
                          discountRate: menu.promotion?.discountRate || "",
                          startDate: menu.promotion?.startDate?.substring(0, 10) || "",
                          endDate: menu.promotion?.endDate?.substring(0, 10) || "",
                        });
                        setViewOnlyPromo(true);
                      }}
                      style={{ ...buttonStyle, backgroundColor: "orange" }}
                    >
                      View Promo
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setPromoData(menu);
                        setPromoForm({ discountRate: "", startDate: "", endDate: "" });
                        setViewOnlyPromo(false);
                      }}
                      style={{ ...buttonStyle, backgroundColor: "#ffc107", color: "#000" }}
                    >
                      Add Promo
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(menu)}
                    style={{ ...buttonStyle, backgroundColor: "green", color: "white" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu._id)}
                    style={{ ...buttonStyle, backgroundColor: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// ✨ Inline Styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#fff",
};

const theadStyle = {
  backgroundColor: "#fdd835",
  borderBottom: "2px solid #ccc",
};

const thStyle = {
  padding: "12px 16px",
  fontWeight: "bold",
  textAlign: "left",
  border: "1px solid #ccc",
};

const tdStyle = {
  padding: "12px 16px",
  border: "1px solid #ccc",
  verticalAlign: "top",
};

const rowStyleEven = {
  backgroundColor: "#fff",
};

const rowStyleOdd = {
  backgroundColor: "#f9f9f9",
};

const imageStyle = {
  width: "60px",
  height: "60px",
  objectFit: "cover",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const actionButtonGroup = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

export default MenuTable;
