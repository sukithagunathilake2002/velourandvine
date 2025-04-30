import React from "react";

const MenuTable = ({ menus, onEdit, onDelete, onPromo }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Actual Price</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {menus.map((menu) => (
          <tr key={menu._id} className="text-center">
            <td className="p-2 border">{menu.name}</td>
            <td className="p-2 border">{menu.category}</td>
            <td className="p-2 border">Rs. {menu.price}</td>
            <td className="p-2 border">Rs. {menu.actualPrice}</td>
            <td className="p-2 border space-x-2">
              <button onClick={() => onPromo(menu)} className="bg-blue-500 text-white px-2 py-1 rounded">
                Promotion
              </button>
              <button onClick={() => onEdit(menu._id)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                Edit
              </button>
              <button onClick={() => onDelete(menu._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </td>
          </tr>
        ))}
        {menus.length === 0 && (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-500">
              No menu items found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MenuTable;
