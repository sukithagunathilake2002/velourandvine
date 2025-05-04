import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "../styles/Home.css";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
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
            <span className={isOpen ? "show" : "hide"}>Order Details</span>
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

const Home = () => {
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "staff") {
      setIsStaff(true);
    }
  }, []);

  const carouselImages = [image1, image2, image3, image4];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="container">
      {isStaff && <AdminNavBar />}
      <div className="main-content">
        <div className="home-container">
          {/* First Section: Carousel */}
          <div className="carousel-container">
            <Slider {...settings}>
              {carouselImages.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`Slide ${index + 1}`} className="carousel-image" />
                </div>
              ))}
            </Slider>
          </div>

          {/* First Section Below Carousel */}
          <div className="text-section text-left">
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui 
              blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
            </p>
            <img src={image4} alt="Food Dish" className="text-image" />
          </div>

          {/* Second Section Below Carousel */}
          <div className="text-section text-right">
            <img src={image3} alt="Monochrome Interior" className="text-image" />
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui 
              blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
            </p>
          </div>

          {/* Dual Image Section */}
          <div className="dual-image-section">
            <img src={image4} alt="Dining Experience" className="left-image" />
            <div className="overlay-container">
              <img src={image5} alt="Chef Plating Dish" className="right-image" />
              <div className="overlay-text-box">
                <h2>25 Dishes, endless elegance. Velour & Vine.</h2>
              </div>
            </div>
          </div>

          {/* Fourth Section */}
          <div className="highlight-section">
            <img src={image5} alt="Fine Dining" className="highlight-image" />
            <h2 className="overlay-text">25 dishes, endless elegance. Velour & Vine</h2>
          </div>

          {/* Closing Message */}
          <div className="closing-message">
            <p>
              "Indulge in elegance with our carefully curated menu of 25 exquisite dishes. 
              From delightful appetizers to decadent desserts, each plate promises a new 
              journey of flavors.<br /><br />
              Come, explore, and treat yourself to a dining experience like no other 
              at Velour & Vine."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
