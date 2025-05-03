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
import StaffOrderPage from './components/CStaffOrderPage';
import EditOrderPage from './components/EditOrderPage';
import FavoritesPage from "./components/FavoritesPage";
import BasketPage from "./components/BasketPage";
import { AuthProvider } from "./context/AuthContext";
import OrderStatusPage from "./components/OrderStatusPage";
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";
import CartPage from "./components/CartPage"; // New CartPage
import PaymentPage from "./components/PaymentPage"; // New PaymentPage

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
        <Route path="/staff/orders" element={<StaffOrderPage/>}/>
        <Route path="/staff/orders/edit/:orderId" element={<EditOrderPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route Path="/reservations" element={<ReservationList/>} />
        <Route path="/cart" element={<CartPage />} /> {/* New Cart route */}
        <Route path="/payment" element={<PaymentPage />} /> {/* New Payment route */}
    
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
      <AuthProvider>
      <Layout />
      </AuthProvider>
    </Router>
  );
};

export default App;
