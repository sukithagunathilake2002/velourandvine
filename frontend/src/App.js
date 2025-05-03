import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import AdminPage from "./components/AdminPage";
import AboutUs from "./components/About";
import LoginPage from"./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfile from "./pages/UserProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import OrderPage from './components/OrderPage';
import StaffOrderPage from './components/StaffOrderPage';
import EditOrderPage from './components/EditOrderPage';
import AdminMenuPage from "./pages/AdminMenuPage";
import ContactForm from './components/ContactForm';
import AdminMessageList from './components/AdminMessageList';
import CustomerMenuView from './pages/CustomerMenuView';





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
        <Route path="/admindashboard" element={<AdminPage />} />
       
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/AdminMenus" element={<AdminMenuPage />} />
        <Route path="/cuntactus" element={<ContactForm/>}/>
        <Route path="/admincuntact" element={<AdminMessageList/>}/>

        <Route path="/customermenu" element={<CustomerMenuView/>}/>
        

        
       
        
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
