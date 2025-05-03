import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserReservations.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/reservations/my"; // GET own reservations
const DELETE_URL = "http://localhost:5000/api/reservations"; // + /:id
const UPDATE_URL = "http://localhost:5000/api/reservations"; // + /:id

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReservations(res.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleEditClick = (reservation) => {
    setEditingId(reservation._id);
    setFormData({
      customerPhone: reservation.customerPhone,
      date: reservation.date,
      timeSlot: reservation.timeSlot,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${UPDATE_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEditingId(null);
      fetchReservations();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`${DELETE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchReservations();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  return (
    <div className="user-reservations-container">
      <h2>My Reservations</h2>

      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="reservation-card-list">
          {reservations.map((res) => (
            <div className="reservation-card" key={res._id}>
              <div className="reservation-card-header">
                <h3>Table {res.tableId?.number || "N/A"}</h3>
                <span className={`status ${res.status.toLowerCase()}`}>
                  {res.status}
                </span>
              </div>

              <div className="reservation-card-body">
                <div className="card-field">
                  <strong>Date:</strong>
                  {editingId === res._id ? (
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  ) : (
                    <span>{res.date}</span>
                  )}
                </div>

                <div className="card-field">
                  <strong>Time:</strong>
                  {editingId === res._id ? (
                    <select
                      value={formData.timeSlot}
                      onChange={(e) =>
                        setFormData({ ...formData, timeSlot: e.target.value })
                      }
                    >
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                    </select>
                  ) : (
                    <span>{res.timeSlot}</span>
                  )}
                </div>

                <div className="card-field">
                  <strong>Phone:</strong>
                  {editingId === res._id ? (
                    <input
                      type="text"
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span>{res.customerPhone}</span>
                  )}
                </div>
              </div>

              <div className="reservation-card-actions">
                {editingId === res._id ? (
                  <>
                    <button className="save-btn" onClick={() => handleUpdate(res._id)}>
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(res)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(res._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReservations;
