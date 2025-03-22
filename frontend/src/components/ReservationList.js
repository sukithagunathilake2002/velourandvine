import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ReservationList.css"; // Unique styling for this page

const API_URL = "http://localhost:5000/api/reservations"; // Adjust based on your backend URL

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});

  // ✅ Fetch all reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // ✅ Fetch Reservations
  const fetchReservations = async () => {
    try {
      const response = await axios.get(API_URL);
      setReservations(response.data);
    } catch (error) {
      setMessage("Error fetching reservations. Please try again.");
      console.error("Fetch error:", error);
    }
  };

  // ✅ Handle status change in dropdown
  const handleStatusChange = (reservationId, newStatus) => {
    setSelectedStatus({ ...selectedStatus, [reservationId]: newStatus });
  };

  // ✅ Update reservation status in the backend
  const updateStatus = async (reservationId) => {
    try {
      await axios.put(`${API_URL}/${reservationId}`, {
        status: selectedStatus[reservationId],
      });
      setMessage("Reservation status updated successfully!");
      fetchReservations(); // Refresh the reservation list
    } catch (error) {
      setMessage("Failed to update status. Please try again.");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="reservation-list-container">
      <h2>Reservation List</h2>
      {message && <p className="message">{message}</p>}

      {reservations.length === 0 ? (
        <p>No reservations available.</p>
      ) : (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Table Number</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.customerName}</td>
                <td>{reservation.customerEmail}</td>
                <td>{reservation.customerPhone}</td>
                <td>Table {reservation.tableId.number} (Seats: {reservation.tableId.capacity})</td>
                <td>{reservation.date}</td>
                <td>{reservation.timeSlot}</td>
                <td>{reservation.status}</td>
                <td>
                  <select
                    value={selectedStatus[reservation._id] || reservation.status}
                    onChange={(e) =>
                      handleStatusChange(reservation._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => updateStatus(reservation._id)}
                    className="update-button"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservationList;
