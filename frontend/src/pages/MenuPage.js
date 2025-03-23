import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Menuco.css"; // Your existing CSS file
import "../styles/ModalMessage.css"; // Import the modal-specific CSS
import AppetizersImg from "../assets/AppetizerMe.png";
import MainCoursesImg from "../assets/MainCoursesMe.png";
import SaladsImg from "../assets/SaladsMe.png";
import DessertsImg from "../assets/DessertsMe.png";
import WineSelectionImg from "../assets/WineSelectionMe.png";
import SignatureCocktailsImg from "../assets/SignaturecocktailsMe.png";

const Menu = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [menu, setMenu] = useState([]);
  const [showModal, setShowModal] = useState(false); // state for showing/hiding the modal

  const categories = [
    { name: "Appetizers", image: AppetizersImg, path: "/appetizers" },
    { name: "Main Courses", image: MainCoursesImg, path: "/main-courses" },
    { name: "Salads", image: SaladsImg, path: "/salads" },
    { name: "Desserts", image: DessertsImg, path: "/desserts" },
    { name: "Wine Selection", image: WineSelectionImg, path: "/wine-selection" },
    { name: "Signature Cocktails", image: SignatureCocktailsImg, path: "/signature-cocktails" },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            const response = await axios.get(
              `http://127.0.0.1:5000/api/weather/get-weather?lat=${latitude}&lon=${longitude}`
            );
            setWeather(response.data);

            // Fetch recommended menu based on the city (weather data)
            const menuResponse = await axios.get(
              `http://127.0.0.1:5000/api/menu?city=${response.data.city}`
            );
            setMenu(menuResponse.data.menu);
          } catch (error) {
            console.error("Error fetching weather or menu data:", error);
          }
        },
        (error) => console.error("Geolocation Error:", error),
        { timeout: 10000 }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  }, []);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="menu-wrapper">
      <div className="menu-header">
        <div className="menu-overlay">
          <div className="menu-title-box">
            <h1 className="menu-title">MENU</h1>
          </div>
        </div>
      </div>
    

      <div className="menu-container">
        <div className="menu-content">
          <h2 className="menu-subtitle">Make your Order</h2>
          <h3 className="menu-heading">Dishes On Our Menu</h3>
          <p className="menu-description">
            That’s a beautiful name for a restaurant! With <b>Velour & Vine</b>, it sounds like a classy, elegant place with a focus on quality ingredients and fine dining.
            <br />Here’s a refined and aesthetic menu concept that complements the name:
          </p>
        </div>
          {/* Button to trigger the modal */}
          {weather && (
          <button onClick={handleShowModal} className="show-weather-btn">
            Show Weather and Recommended Dishes
          </button>
        )}
        <div className="menu-categories">
          {categories.map((category, index) => (
            <div key={index} className="menu-category" onClick={() => navigate(category.path)}>
              <img src={category.image} alt={category.name} className="menu-category-image" />
              <h2 className="menu-category-name">{category.name}</h2>
            </div>
          ))}
        </div>

      
        {/* Modal for Weather and Recommended Dishes */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Weather in {weather.city}</h2>
              <p>
                Current Weather: {weather.temperature}°C, {weather.condition}
              </p>
              <p>
                Your Location: Latitude: {location?.latitude}, Longitude: {location?.longitude}
              </p>

              {/* Display Recommended Dishes */}
              <h3>Recommended Dishes Based on Weather:</h3>
              <ul>
                {menu.length > 0 ? (
                  menu.map((dish, index) => (
                    <li key={index}>
                      <strong>{dish.name}</strong>: {dish.description}
                    </li>
                  ))
                ) : (
                  <p>Loading recommended dishes...</p>
                )}
              </ul>

              <button onClick={handleCloseModal} className="close-modal-btn">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
