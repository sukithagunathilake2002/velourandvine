import React, { useState, useEffect } from "react";
import "../styles/AboutUs.css";
import backgroundImage from "../assets/image3.png";
import visionImage from "../assets/vision.jpg";
import missionImage from "../assets/mission.jpg";
import { useNavigate, Link } from "react-router-dom";
import { FaBars, FaTimes, FaClipboardList } from "react-icons/fa";
import "../styles/AdminNavBar.css";

function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="header">
        <h1 className={isOpen ? "show" : "hide"}>Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      <nav>
        <ul>
          <li className="nav-item">
            <Link to="/AdminMenus" className="Nav-Link">
              <span className={isOpen ? "show" : "hide"}>Menus</span>
            </Link>
          </li>
          <li className="nav-item">
            <span className={isOpen ? "show" : "hide"}>Reservations</span>
          </li>
          <li
            className="nav-item"
            onClick={() => navigate("/staff/orders")}
            style={{ cursor: "pointer" }}
          >
            <FaClipboardList className="icon" />
            <span className={isOpen ? "show" : "hide"}>Order Details</span>
          </li>
          <li className="nav-item">
            <span className={isOpen ? "show" : "hide"}>Menu List</span>
          </li>
          <li className="nav-item">
            <span className={isOpen ? "show" : "hide"}>Order Details</span>
          </li>
          <li className="nav-item">
            <Link to="/admincuntact" className="Nav-Link">
              <span className={isOpen ? "show" : "hide"}>Contact Us</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const AboutUs = () => {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "staff") {
      setIsStaff(true);
    }
  }, []);

  const content = (
    <div className="about-us-container">
      {/* Background Image Header */}
      <div
        className="about-us-header"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="about-us-title">About Us</h1>
      </div>

      {/* Content Section */}
      <div className="about-us-content">
        <h2 className="about-us-history-title">Our History</h2>
        <p className="about-us-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged.
        </p>

        {/* Video Section */}
        <div className="about-us-video-container">
          <iframe
            className="about-us-video"
            src="https://www.youtube.com/embed/WW0SLuX8HsI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="vision-mission-section">
        <div className="vision-container">
          <h2 className="vision-title">Our Vision</h2>
          <img src={visionImage} alt="Our Vision" className="vision-image" />
          <p className="vision-text">
            "To be the epitome of elegance and flavor, creating unforgettable dining
            experiences with every dish."
          </p>
        </div>
        <div className="mission-container">
          <h2 className="mission-title">Our Mission</h2>
          <img src={missionImage} alt="Our Mission" className="mission-image" />
          <p className="mission-text">
            "To craft exquisite cuisine using the finest ingredients, blending sophistication
            with warmth, and offering an ambiance that delights the senses."
          </p>
        </div>
      </div>
    </div>
  );

  return isStaff ? (
    <div className="container">
      <AdminNavBar />
      <div className="main-content">{content}</div>
    </div>
  ) : (
    content
  );
};

export default AboutUs;
