import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; 
import AddTable from "./components/AddTable";
import TableList from "./components/TableList"; 
import TableIllustration from "./components/TableIllustration";
import Home from "./components/Home";
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdminPage from "./components/AdminPage";
import Menu from "./components/Menu";
import AboutUs from "./components/About";
import LoginPage from"./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"


const Layout = () => {
  const location = useLocation();
  const hideFooterOnPaths = ["/login", "/register"];  // Add paths where footer should be hidden

  return (
    <>
      <Navbar />
      <Routes>

        
        <Route path="/" element={<Home />} />
        <Route path="/admindashboard" element={<AdminPage/>} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/AboutUs" element={<AboutUs/>} />
        <Route path="/LoginPage" element={<LoginPage/>}/>
        <Route path="/RegisterPage" element={<RegisterPage/>}/>
        <Route path="/UserProfile" element={<UserProfile/>}/>
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage/>}/>
        
        
      </Routes>
      {!hideFooterOnPaths.includes(location.pathname) && <Footer />}  {/* Hide footer if on specific paths */}
    </>
  );
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/add-table" element={<AddTable />} />
        <Route path="/reserve" element={<ReservationForm />} />
        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/tables" element={<TableList />} /> 
        <Route path="/tableplan" element={<TableIllustration />} />
      </Routes>
      <Layout />
    </Router>
  );
}

export default App;
