import React from "react";
import AdminNavBar from "./AdminNavBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/AdminNavBar.css"; // Ensure you create styles for proper layout

const AdminPage = () => {
  return (
    <div className="admin-page">
    
      
      <div className="admin-container">
        {/* Sidebar navigation */}
        <AdminNavBar />
        
        {/* Main Admin Dashboard Content */}
        
      </div>
      
     
    </div>
  );
};

export default AdminPage;
