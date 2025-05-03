import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdminPage from "./components/AdminPage";
import MenuPage from "./pages/MenuPage"; // Import MenuPage here
import AboutUs from "./components/About";
import LoginPage from"./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import OrderPage from './components/OrderPage';
import StaffOrderPage from './components/StaffOrderPage';
import EditOrderPage from './components/EditOrderPage';
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";
import TableIllustration from "./components/TableIllustration";
import TableList from "./components/TableList";
import AddTable from "./components/AddTable";
import RecentOrder from "./components/OrderReminderModal"




const Layout = () => {
  const location = useLocation();
  const hideFooterOnPaths = ["/login", "/register"]; // Paths where the footer should be hidden

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admindashboard" element={<AdminPage/>} />
        <Route path="/AboutUs" element={<AboutUs/>} />
        <Route path="/LoginPage" element={<LoginPage/>}/>
        <Route path="/RegisterPage" element={<RegisterPage/>}/>
        <Route path="/UserProfile" element={<UserProfile/>}/>
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage/>}/>
        <Route path="/order" element={<OrderPage/>} />
        <Route path="/staff/orders" element={<StaffOrderPage />} />
        <Route path="/staff/orders/edit/:orderId" element={<EditOrderPage />} />
        <Route path="/staff/orders/edit/:orderId" element={<EditOrderPage />} />
        <Route path="/reserve" element={<ReservationForm/>} />
        <Route path="/reservations" element={<ReservationList/>} />
        <Route path="/tableplan" element={<TableIllustration/>} />
        <Route path="/tables" element={<TableList/>} />
        <Route path="/add-table" element={<AddTable/>} />

        <Route path="/admindashboard" element={<AdminPage />} />
        <Route path="/Menu" element={<MenuPage />} /> {/* Updated to use Menu */}
        <Route path="/aboutus" element={<AboutUs />} />
        
        <Route path="/R" element={<RecentOrder />} />
        
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
