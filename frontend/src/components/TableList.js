import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TableList.css";

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    status: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tables");
      setTables(res.data);
    } catch (error) {
      alert("Error fetching tables");
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table._id);
    setFormData({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    const { number, capacity, status } = formData;

    if (!number || number < 1) {
      alert("Table number must be at least 1.");
      return;
    }
    if (!capacity || capacity < 1 || capacity > 20) {
      alert("Capacity must be between 1 and 20.");
      return;
    }
    if (!["available", "reserved", "occupied"].includes(status)) {
      alert("Invalid status.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/tables/${id}`, formData);
      alert("Table updated successfully!");
      fetchTables();
      setEditingTable(null);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/tables/${id}`);
      alert("Table deleted successfully!");
      fetchTables();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Table Management</h2>
        <button className="add-table-btn" onClick={() => navigate("/add-table")}>
          Add New Table
        </button>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table._id}>
              <td>
                {editingTable === table._id ? (
                  <input
                    type="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                  />
                ) : (
                  table.number
                )}
              </td>
              <td>
                {editingTable === table._id ? (
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                ) : (
                  table.capacity
                )}
              </td>
              <td>
                {editingTable === table._id ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                ) : (
                  table.status
                )}
              </td>
              <td>
                {editingTable === table._id ? (
                  <button
                    className="save-btn"
                    onClick={() => handleUpdate(table._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(table)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(table._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
