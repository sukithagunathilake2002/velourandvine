import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordPage.css"; // ✅ Import the scoped CSS

const ForgotPasswordPage = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const response = await forgotPassword(form.email, form.newPassword, form.confirmPassword);

    if (response.success) {
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="forgot-password-page"> {/* ✅ Scoped styles */}
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
          <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <button type="submit">Reset Password</button>
        </form>
        <p><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
