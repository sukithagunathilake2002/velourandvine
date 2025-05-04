import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ContactForm.css';
import { useNavigate, Link } from "react-router-dom";
import { FaBars, FaTimes, FaClipboardList } from "react-icons/fa";
import "../styles/AdminNavBar.css";

function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
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
            <Link to="/AdminMenus" className="Nav-Link">
              <span className={isOpen ? "show" : "hide"}>Menus</span>
            </Link>
          </li>
          <li className="nav-item">
            <span className={isOpen ? "show" : "hide"}>Reservations</span>
          </li>
          <li
            className="nav-item"
            onClick={() => navigate("/staff/orders")}
            style={{ cursor: "pointer" }}
          >
            <FaClipboardList className="icon" />
            <span className={isOpen ? "show" : "hide"}>Order Details</span>
          </li>
          <li className="nav-item">
            <span className={isOpen ? "show" : "hide"}>Menu List</span>
          </li>
          <li className="nav-item">
            <Link to="/admincuntact" className="Nav-Link">
              <span className={isOpen ? "show" : "hide"}>Contact Us</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "staff") {
      setIsStaff(true);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    return newErrors;
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      alert('Message sent!');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Failed to send message'));
    }
  };

  const contactFormContent = (
    <div className="contact-section">
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <h3>Send Us a Message</h3>

        <div className="form-group">
          <input
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            name="phone"
            placeholder="Phone (10 digits)"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <p className="error-text">{errors.message}</p>}
        </div>

        <button type="submit">Send Message</button>
      </form>

      {/* Map Below Form */}
      <div className="map-below-form">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d73221.12556873275!2d79.86211533056405!3d6.8938868980774375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593fe2a5c88f%3A0x7addbe3139cd2388!2sElevate%20by%20Jetwing!5e0!3m2!1sen!2slk!4v1746171930226!5m2!1sen!2slk"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map - Elevate by Jetwing"
        ></iframe>
      </div>
    </div>
  );

  return isStaff ? (
    <div className="container">
      <AdminNavBar />
      <div className="main-content">{contactFormContent}</div>
    </div>
  ) : (
    contactFormContent
  );
}

export default ContactForm;
