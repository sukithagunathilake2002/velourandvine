import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CustomerMenuView.css";
import "../styles/ModalMessage.css"; // <-- make sure this is included for the modal

const API_BASE = "http://localhost:5000/api/menus/all";

function CustomerMenuView() {
  const [menus, setMenus] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [recommendedMenu, setRecommendedMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Appetizers",
    "Main Courses",
    "Salads",
    "Desserts",
    "Wine Selection",
    "Signature Cocktails",
  ];

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE}${filteredCategory ? `?category=${filteredCategory}` : ""}`
        );
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [filteredCategory]);

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

            const menuResponse = await axios.get(
              `http://127.0.0.1:5000/api/menu?city=${response.data.city}`
            );
            setRecommendedMenu(menuResponse.data.menu);
          } catch (error) {
            console.error("Error fetching weather or recommended menu:", error);
          }
        },
        (error) => console.error("Geolocation Error:", error),
        { timeout: 10000 }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  }, []);

  const handleAddToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((i) => i._id === item._id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("selectedItemName", item.name);
    alert(`${item.name} added to cart`);
    navigate("/order");
  };

  const isPromoActive = (promo) => {
    if (!promo || !promo.startDate || !promo.endDate) return false;
    const now = new Date();
    return new Date(promo.startDate) <= now && new Date(promo.endDate) >= now;
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="menu-page">
      <aside className="sidebar">
        <h4>Menu Categories</h4>
        <ul className="category-list">
          <li
            className={!filteredCategory ? "active" : ""}
            onClick={() => setFilteredCategory("")}
          >
            All Categories
          </li>
          {categories.map((cat) => (
            <li
              key={cat}
              className={filteredCategory === cat ? "active" : ""}
              onClick={() => setFilteredCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      <main className="menu-content">
        <h2 className="menu-title">Our Menu</h2>

        {weather && (
          <button onClick={handleShowModal} className="show-weather-btn">
            Show Weather and Recommended Dishes
          </button>
        )}

        {loading ? (
          <p className="menu-loading">Loading...</p>
        ) : menus.length === 0 ? (
          <p className="menu-empty">No menu items found.</p>
        ) : (
          <div className="menu-grid">
            {menus.map((item) => {
              const hasPromo = isPromoActive(item.promotion);
              const actualPrice = hasPromo
                ? item.price - (item.price * item.promotion.discountRate) / 100
                : item.price;

              return (
                <div className="menu-card" key={item._id}>
                  <div className="menu-image-container">
                    {item.image && (
                      <img
                        src={`http://localhost:5000/${item.image}`}
                        alt={item.name}
                        className="menu-image"
                      />
                    )}
                    {hasPromo && <div className="promo-badge">PROMOTION</div>}
                  </div>

                  <div className="menu-card-body">
                    <h5 className="menu-name">{item.name}</h5>
                    <p className="menu-description">{item.description}</p>
                    <p className="menu-category">
                      <strong>Category:</strong> {item.category}
                    </p>

                    {hasPromo ? (
                      <>
                        <p className="menu-offer">
                          <strong>Offer:</strong> {item.promotion.discountRate}% OFF
                        </p>
                        <p className="menu-price">
                          <span className="menu-original-price strikethrough">
                            Rs. {item.price.toFixed(2)}
                          </span>{" "}
                          <span className="menu-discounted-price">
                            Rs. {actualPrice.toFixed(2)}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="menu-price">
                        <strong>Price:</strong> Rs. {item.price.toFixed(2)}
                      </p>
                    )}

                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

              <h3>Recommended Dishes Based on Weather:</h3>
              <ul>
                {recommendedMenu.length > 0 ? (
                  recommendedMenu.map((dish, index) => (
                    <li key={index}>
                      <strong>{dish.name}</strong>: {dish.description}
                    </li>
                  ))
                ) : (
                  <p>Loading recommended dishes...</p>
                )}
              </ul>

              <button onClick={handleCloseModal} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerMenuView;
