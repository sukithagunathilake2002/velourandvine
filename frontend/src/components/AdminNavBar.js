import { useState } from "react";
import { FaUtensils, FaClipboardList, FaRobot, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import "../styles/AdminNavBar.css";

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
              <FaUtensils className="icon" /> <span className={isOpen ? "show" : "hide"}>Reservations</span>
            </li>
            <li className="nav-item">
              <MdOutlineRestaurantMenu className="icon" /> <span className={isOpen ? "show" : "hide"}>Menu</span>
            </li>
            <li className="nav-item">
              <FaClipboardList className="icon" /> <span className={isOpen ? "show" : "hide"}>Order Details</span>
            </li>
            <li className="nav-item">
              <FaRobot className="icon" /> <span className={isOpen ? "show" : "hide"}>AI Features</span>
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
