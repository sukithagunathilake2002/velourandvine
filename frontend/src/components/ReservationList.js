import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/ReservationList.css";

const API_URL = "http://localhost:5000/api/reservations";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const today = new Date().toISOString().split("T")[0];

      // Filter out past reservations from backend response
      const upcoming = res.data.filter((r) => r.date >= today);

      setReservations(upcoming);
      setFilteredReservations(upcoming);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `${API_URL}/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchReservations();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (!date) {
      setFilteredReservations(reservations);
    } else {
      const filtered = reservations.filter((r) => r.date === date);
      setFilteredReservations(filtered);
    }
  };

  const generatePDF = (data, title) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const tableData = data.map((res) => [
      res.customerName,
      res.customerEmail,
      res.customerPhone,
      res.tableId?.number || "N/A",
      res.date,
      res.timeSlot,
      res.status,
    ]);

    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Table", "Date", "Time", "Status"]],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: [212, 175, 55], // Gold
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [255, 253, 208], // Cream
      },
    });

    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  return (
    <div className="reservation-list-container">
      <h2>All Reservations</h2>

      <div className="filter-bar">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateFilter}
        />
        <button
          onClick={() =>
            generatePDF(filteredReservations, "Filtered Reservation Report")
          }
        >
          Download PDF (Filtered)
        </button>
        <button
          onClick={() =>
            generatePDF(reservations, "Full Reservation Report")
          }
        >
          Download PDF (All)
        </button>
      </div>

      <table className="reservation-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Table</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.length === 0 ? (
            <tr>
              <td colSpan="8">No reservations found.</td>
            </tr>
          ) : (
            filteredReservations.map((res) => (
              <tr key={res._id}>
                <td>{res.customerName}</td>
                <td>{res.customerEmail}</td>
                <td>{res.customerPhone}</td>
                <td>{res.tableId?.number || "N/A"}</td>
                <td>{res.date}</td>
                <td>{res.timeSlot}</td>
                <td>{res.status}</td>
                <td>
                  <select
                    value={res.status}
                    onChange={(e) =>
                      handleStatusChange(res._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;
