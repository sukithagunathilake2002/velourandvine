import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/OrderPage.css";
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

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({ shouldUnregister: false });

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const axiosWithAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "staff") {
      setIsStaff(true);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menus/all")
      .then((res) => {
        setMenuItems(res.data);

        setTimeout(() => {
          const selectedItemName = localStorage.getItem("selectedItemName");
          if (selectedItemName) {
            const element = document.getElementById(`menu-item-${selectedItemName}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            localStorage.removeItem("selectedItemName");
          }
        }, 500);
      })
      .catch((err) => console.error("Error fetching menu items:", err));

    const userId = decodedToken?.id;
    if (userId) {
      axios
        .get(`http://localhost:5000/order-recommendations/${userId}`)
        .then((res) => {
          const recs = res.data.recommendations;
          setRecommendations(recs);
          if (recs.length > 0) setShowModal(true);
        })
        .catch((err) => console.error("Error fetching recommendations:", err));

      const storedOrderId = localStorage.getItem(`lastOrderId_${userId}`);
      if (storedOrderId) {
        setOrderId(storedOrderId);
      } else {
        axiosWithAuth
          .get(`http://localhost:5000/orders/all?customerId=${userId}`)
          .then((res) => {
            const orders = res.data;
            if (orders.length > 0) {
              const latestOrder = orders.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )[0];
              setOrderId(latestOrder._id);
              localStorage.setItem(`lastOrderId_${userId}`, latestOrder._id);
            }
          })
          .catch((err) =>
            console.error("Error fetching latest order:", err.response?.data || err.message)
          );
      }
    }

    fetchCart();
  }, [user]);

  const fetchCart = () => {
    const userId = decodedToken?.id;
    const localCartKey = userId ? `cart_${userId}` : "cart_guest";
    const localCart = JSON.parse(localStorage.getItem(localCartKey) || "[]");

    if (userId) {
      axiosWithAuth
        .get(`http://localhost:5000/cart/${userId}`)
        .then((res) => {
          const serverCart = res.data.items || [];
          const mergedCart = [
            ...serverCart.filter(
              (sItem) =>
                !localCart.some((lItem) => lItem.menuItemId === sItem.menuItemId)
            ),
            ...localCart,
          ];
          setCart(mergedCart);
          saveCart(mergedCart);
        })
        .catch((err) => {
          console.error("Error fetching cart:", err.response?.data || err.message);
          setCart(localCart);
        });
    } else {
      setCart(localCart);
    }
  };

  const saveCart = async (updatedCart) => {
    const userId = decodedToken?.id;
    const localCartKey = userId ? `cart_${userId}` : "cart_guest";

    const cartWithCalculations = updatedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      price: item.price || 0,
      subtotal: (item.price || 0) * (item.quantity || 1),
    }));

    if (userId) {
      try {
        await axiosWithAuth.post(`http://localhost:5000/cart/${userId}`, {
          items: cartWithCalculations,
        });
        localStorage.setItem(localCartKey, JSON.stringify(cartWithCalculations));
      } catch (err) {
        console.error("Error saving cart to server:", err.response?.data || err.message);
        localStorage.setItem(localCartKey, JSON.stringify(cartWithCalculations));
      }
    } else {
      localStorage.setItem(localCartKey, JSON.stringify(cartWithCalculations));
    }
  };

  const addToCart = (itemId, data) => {
    const menuItem = menuItems.find((m) => m._id === itemId);
    if (!menuItem) return;

    const quantity = parseInt(data[`quantity_${itemId}`]) || 1;
    const newItem = {
      menuItemId: itemId,
      name: menuItem.name,
      quantity,
      specialInstructions: data[`specialInstructions_${itemId}`] || "",
      price: menuItem.price,
      subtotal: menuItem.price * quantity,
    };

    setCart((prevCart) => {
      const updatedCart = prevCart.some((item) => item.menuItemId === itemId)
        ? prevCart.map((item) =>
            item.menuItemId === itemId ? { ...item, ...newItem } : item
          )
        : [...prevCart, newItem];
      saveCart(updatedCart);
      navigate("/cart");
      return updatedCart;
    });
  };

  const addToFavorites = (item) => {
    const userId = decodedToken?.id;
    const favoritesKey = userId ? `favorites_${userId}` : "favorites_guest";
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");

    if (!favorites.find((fav) => fav.menuItemId === item._id)) {
      favorites.push({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        specialInstructions: "",
      });
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
      alert(`${item.name} added to favorites!`);
    } else {
      alert(`${item.name} is already in favorites!`);
    }
  };

  const addToBasket = (item) => {
    const userId = decodedToken?.id;
    const basketKey = userId ? `basket_${userId}` : "basket_guest";
    const basket = JSON.parse(localStorage.getItem(basketKey) || "[]");

    if (!basket.find((b) => b.menuItemId === item._id)) {
      basket.push({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        specialInstructions: "",
      });
      localStorage.setItem(basketKey, JSON.stringify(basket));
      alert(`${item.name} added to basket!`);
    } else {
      alert(`${item.name} is already in your basket!`);
    }
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="order-bg">
      {isStaff && <AdminNavBar />}
      <div className="order-page">
        <div className="header-icons">
          <button className="icon-btn" onClick={() => navigate("/favorites")} title="Favorites">❤️</button>
          <button className="icon-btn" onClick={() => navigate("/basket")} title="Basket">🧺</button>
        </div>
        <h1>Create an Order</h1>
        {!user && <p>Please log in to save your cart across sessions!</p>}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search menu items for order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <form>
          <h2>Menu Items</h2>
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div key={item._id} className="menu-item" id={`menu-item-${item.name}`}>
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.name}
                  className="menu-item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/order-images/default.jpg";
                  }}
                />
                <p>{item.name} — Rs. {item.price.toFixed(2)}</p>
                <div>
                  <label>Quantity:</label>
                  <input
                    id={`quantity_${item._id}`}
                    type="number"
                    min={1}
                    defaultValue={1}
                    {...register(`quantity_${item._id}`)}
                  />
                </div>
                <div>
                  <label>Special Instructions:</label>
                  <input
                    id={`specialInstructions_${item._id}`}
                    type="text"
                    placeholder="Any notes?"
                    {...register(`specialInstructions_${item._id}`)}
                  />
                </div>
                <div className="button-group">
                  <button type="button" onClick={handleSubmit((data) => addToCart(item._id, data))}>
                    Add to Cart
                  </button>
                  <button type="button" className="favorite-btn" onClick={() => addToFavorites(item)}>
                    Add to Favorites
                  </button>
                  <button type="button" className="basket-btn" onClick={() => addToBasket(item)}>
                    Add to Basket
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No menu items found.</p>
          )}
        </form>
        <div className="order-status-section">
          <button
            onClick={() => {
              if (!orderId) {
                alert("⚠️ Place an order first!");
                return;
              }
              navigate(`/order-status/${orderId}`);
            }}
          >
            Check Order Status
          </button>
        </div>

        {showModal && (
          <div className="recommendation-modal">
            <div className="recommendation-modal-content">
              <h2>Recommended for You</h2>
              <ul>
                {recommendations.map((dish, index) => (
                  <li key={index}>
                    <strong>{dish.name}</strong>: {dish.description}
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowModal(false)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
