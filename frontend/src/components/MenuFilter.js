import React from "react";

const MenuFilter = ({ category, setCategory, onAddMenu }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">All Categories</option>
        <option>Appetizers</option>
        <option>Main Courses</option>
        <option>Salads</option>
        <option>Desserts</option>
        <option>Wine Selection</option>
        <option>Signature Cocktails</option>
      </select>

      <button
        onClick={onAddMenu}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Menu
      </button>
    </div>
  );
};

export default MenuFilter;
