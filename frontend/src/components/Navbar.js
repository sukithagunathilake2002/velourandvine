import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import cartIcon from "../assets/carticon.jpg";
import profileIcon from "../assets/profileicon.jpeg";

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
        <li><Link to="/about">ABOUT US</Link></li>
        <li><Link to="/menu">MENU</Link></li>
        <li><Link to="/order">ORDER</Link></li>
        <li><Link to="/reservation">RESERVATION</Link></li>
        <li><Link to="/contact">CONTACT US</Link></li>
      </ul>

      {/* Right Section: Cart & Profile */}
      <div className="icons-container">
        <Link to="/cart" className="cart-container">
          <img src={cartIcon} alt="Cart" className="icon cart-icon" />
        </Link>
        <Link to="/signin" className="profile-container">
          <img src={profileIcon} alt="Profile" className="icon profile-icon" />
          <span className="signin-text">Sign In / Sign Up</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
