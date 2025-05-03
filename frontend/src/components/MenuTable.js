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
  <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead style={{ backgroundColor: "#f9f9f9" }}>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Category</th>
        <th>Description</th>
        <th>Price</th>
        <th>Actual Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {menus.map((menu) => {
        const actualPrice =
          menu.promotion?.discountRate > 0 &&
          menu.promotion?.startDate &&
          menu.promotion?.endDate &&
          new Date() >= new Date(menu.promotion.startDate) &&
          new Date() <= new Date(menu.promotion.endDate)
            ? menu.price - (menu.price * menu.promotion.discountRate) / 100
            : menu.price;

        return (
          <tr key={menu._id}>
            <td>
              {menu.image ? (
                <img
                  src={`http://localhost:5000/${menu.image.replace(/\\/g, "/")}`}
                  alt={menu.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                />
              ) : (
                <span style={{ color: "#888" }}>No Image</span>
              )}
            </td>
            <td>{menu.name}</td>
            <td>{menu.category}</td>
            <td>{menu.description || <span style={{ color: "#aaa" }}>No Description</span>}</td>
            <td>Rs. {menu.price}</td>
            <td>Rs. {actualPrice.toFixed(2)}</td>
            <td>
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
                  style={{ ...buttonStyle, backgroundColor: "orange", marginRight: "5px" }}
                >
                  View Promotion
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPromoData(menu);
                    setPromoForm({
                      discountRate: "",
                      startDate: "",
                      endDate: "",
                    });
                    setViewOnlyPromo(false);
                  }}
                  style={{ ...buttonStyle, backgroundColor: "#ffc107", color: "#000", marginRight: "5px" }}
                >
                  ➕ Add Promotion
                </button>
              )}

              <button
                onClick={() => handleEdit(menu)}
                style={{ ...buttonStyle, backgroundColor: "green", color: "white", marginRight: "5px" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(menu._id)}
                style={{ ...buttonStyle, backgroundColor: "red", color: "white" }}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default MenuTable;
