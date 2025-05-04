
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TableReservationLanding.css';
import bannerImage from '../assets/banner.png';
import newreservationImage from '../assets/newreservation.jpg';
import viewreservationImage from '../assets/viewreservation.jpeg';

const ResStaffLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="reservation-container">
      <img
        src={bannerImage}
        alt="Restaurant Banner"
        className="reservation-banner"
      />

      <h1 className="reservation-title">Table and Reservation Management</h1>
      <p className="reservation-description">
     Manage Table Details and Reservation Details.
      </p>

      <div className="reservation-options">
        <div
          className="reservation-card"
          onClick={() => navigate('/tables')}
        >
          <img
            src={newreservationImage}
            alt="New Reservation"
            className="reservation-image"
          />
          <h3 className="reservation-card-title">Table Management</h3>
        </div>

        <div
          className="reservation-card"
          onClick={() => navigate('/reservations')}
        >
          <img
            src={viewreservationImage}
            alt="View Reservation"
            className="reservation-image"
          />
          <h3 className="reservation-card-title">Reservations Management</h3>
        </div>
      </div>
    </div>
  );
};

export default ResStaffLanding;
