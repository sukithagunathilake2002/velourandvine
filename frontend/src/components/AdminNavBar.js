import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/AdminNavBar.css";
import { Link } from "react-router-dom";

function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        <h2>Admin Dashboard</h2>
      </div>
    </div>
  );
}

export default AdminNavBar;
