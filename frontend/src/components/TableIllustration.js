import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSquare } from "react-icons/fi";
import '../styles/TableIllustration.css';

const TableIllustration = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 'available':
        return '#4CAF50'; // Green
      case 'reserved':
        return '#FFEB3B'; // Yellow
      case 'occupied':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Gray
    }
  };

  return (
    <div className="table-illustration">
      <h2>Table Reservation</h2>
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.number}
            className="table-icon" >
            <FiSquare
              size={60}
              style={{ color: getColor(table.status) }}
            />
          
            <p>Table {table.number}</p>
            <p>Seats: {table.capacity}</p>
            <p>{table.status}</p>
          </div>
        ))}
      </div>
      <button className="reserve-button" onClick={() => navigate('/reserve')}>
        Reserve a Table
      </button>

    </div>
  );
};

export default TableIllustration;
