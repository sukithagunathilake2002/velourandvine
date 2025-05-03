import React from "react";

const CategoryFilter = ({ category, setCategory, inputStyle }) => (
  <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
    <option value="">All Categories</option>
    <option>Appetizers</option>
    <option>Main Courses</option>
    <option>Salads</option>
    <option>Desserts</option>
    <option>Wine Selection</option>
    <option>Signature Cocktails</option>
  </select>
);

export default CategoryFilter;
