import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdminPage from "./components/AdminPage";
import MenuPage from "./pages/MenuPage"; // Import MenuPage here
import AboutUs from "./components/About";


const Layout = () => {
  const location = useLocation();
  const hideFooterOnPaths = ["/login", "/register"]; // Paths where the footer should be hidden

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admindashboard" element={<AdminPage />} />
        <Route path="/Menu" element={<MenuPage />} /> {/* Updated to use Menu */}
        <Route path="/aboutus" element={<AboutUs />} />
        
      </Routes>
      {!hideFooterOnPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
