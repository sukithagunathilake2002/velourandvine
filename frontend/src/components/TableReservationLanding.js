
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TableReservationLanding.css';
import bannerImage from '../assets/banner.png';
import newreservationImage from '../assets/newreservation.jpg';
import viewreservationImage from '../assets/viewreservation.jpeg';

const TableReservationLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="reservation-container">
      <img
        src={bannerImage}
        alt="Restaurant Banner"
        className="reservation-banner"
      />

      <h1 className="reservation-title">Table Reservation</h1>
      <p className="reservation-description">
      Book your table at "Veloure and Vine" where curated cuisine and contemporary elegance come together.
      </p>

      <div className="reservation-options">
        <div
          className="reservation-card"
          onClick={() => navigate('/tableplan')}
        >
          <img
            src={newreservationImage}
            alt="New Reservation"
            className="reservation-image"
          />
          <h3 className="reservation-card-title">New Reservation</h3>
        </div>

        <div
          className="reservation-card"
          onClick={() => navigate('/my-reservation')}
        >
          <img
            src={viewreservationImage}
            alt="View Reservation"
            className="reservation-image"
          />
          <h3 className="reservation-card-title">View Reservation</h3>
        </div>
      </div>
    </div>
  );
};

export default TableReservationLanding;
