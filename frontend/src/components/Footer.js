import React from "react";
import "../styles/Footer.css"; // Import the CSS file
import logo from "../assets/logo.jpg"; // Adjusted path for the logo

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo Section */}
        <div className="footer-section logo-section">
          <img src={logo} alt="Velour & Vine Logo" className="footer-logo" />
          <p className="brand-name">VELOUR & VINE</p>
          <p className="tagline">Taste the elegance, feel the wine.</p>
        </div>

        {/* Address Section */}
        <div className="footer-section">
          <h3>Address</h3>
          <p>Velour & Vine</p>
          <p>128 Vineyard Avenue,</p>
          <p>Rosewood Place, Colombo,</p>
          <p>Sri Lanka</p>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: velourandvine@gmail.com</p>
          <p>Phone: +094 713430456</p>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social-section">
          <h3>Follow us on</h3>
          <div className="social-icons">
            <a href="#" className="social-link">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
