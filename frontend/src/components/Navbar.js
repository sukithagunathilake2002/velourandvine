import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import cartIcon from "../assets/carticon.jpg";
import profileIcon from "../assets/profileicon.jpeg";
import '../styles/nav.css'


const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Section: Logo (Clicking on it navigates to Home) */}
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="VELOUR & VINE Logo" className="logo" />
        </Link>
      </div>

      {/* Center Section: Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/AboutUs">ABOUT US</Link></li>
        <li><Link to="/customermenu">MENU</Link></li>
        <li><Link to="/order">ORDER</Link></li>
        <li><Link to="/reservationlanding">RESERVATION</Link></li>
        <li><Link to="/cuntactus">CONTACT US</Link></li>
      </ul>

      {/* Right Section: Cart & Profile */}
      <div className="icons-container">
        <Link to="/cart" className="cart-container">
          <img src={cartIcon} alt="Cart" className="icon cart-icon" />
        </Link>
        <Link to="/UserProfile" className="profile-container">
          <img src={profileIcon} alt="Profile" className="icon profile-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
