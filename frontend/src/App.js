import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // ✅ Import new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* ✅ Added new route */}
      </Routes>
    </Router>
  );
}
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
