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
    </Router>
  );
}

export default App;
