import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/OrderPage.css";

const OrderPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({ shouldUnregister: false });

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const axiosWithAuth = axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const imageMap = {
    "Truffle Brie Crostini": "/order-images/Truffle Brie Crostini.jpg",
    "Smoked Salmon Tartare": "/order-images/Smoked Salmon Tartare.webp",
    "Velour Soup of the Day": "/order-images/Velour Soup of the Day.webp",
    "Goat Cheese & Fig Crostini": "/order-images/Goat Cheese & Fig Crostini.jpg",
    "Pan-Seared Duck Breast": "/order-images/Pan-Seared Duck Breast.jpg",
    "Seared Sea Bass": "/order-images/seared sea bass.jpg",
    "Filet Mignon au Vin": "/order-images/filet-mignon-sauce-au-vin-rouge.jpeg",
    "Vineyard Risotto": "/order-images/Vineyard Risotto.jpg",
    "Roasted Vegetable Medley": "/order-images/roasted vegetable medley.webp",
    "Velour Salad": "/order-images/velour salad.jpg",
    "Burger": "/order-images/burger.jpg",
    "Pizza": "/order-images/pizza.jpg",
    "Drink": "/order-images/drink.jpg",
    "Salad": "/order-images/salad.jpg",
  };

  const fetchCart = () => {
    const userId = decodedToken?.id;
    if (userId) {
      axiosWithAuth
        .get(`http://localhost:5000/cart/${userId}`)
        .then((res) => {
          const serverCart = res.data.items || [];
          const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
          const mergedCart = [
            ...serverCart.filter((sItem) => !localCart.some((lItem) => lItem.menuItemId === sItem.menuItemId)),
            ...localCart,
          ];
          setCart(mergedCart);
          saveCart(mergedCart);
        })
        .catch((err) => {
          console.error("Error fetching cart:", err.response?.data || err.message);
          const localCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
          setCart(localCart);
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart_guest") || "[]");
      setCart(localCart);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/menu/all")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Error fetching menu items:", err));

    const userId = decodedToken?.id;
    if (userId) {
      const storedOrderId = localStorage.getItem(`lastOrderId_${userId}`);
      if (storedOrderId) {
        setOrderId(storedOrderId);
      } else {
        axiosWithAuth
          .get(`http://localhost:5000/orders/all?customerId=${userId}`)
          .then((res) => {
            const orders = res.data;
            if (orders.length > 0) {
              const latestOrder = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
              setOrderId(latestOrder._id);
              localStorage.setItem(`lastOrderId_${userId}`, latestOrder._id);
            }
          })
          .catch((err) => console.error("Error fetching latest order:", err.response?.data || err.message));
      }
    }

    fetchCart();
  }, [user]);

  useEffect(() => {
    const handleStorageChange = () => fetchCart();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveCart = async (updatedCart) => {
    const userId = decodedToken?.id;
    if (userId) {
      try {
        await axiosWithAuth.post(`http://localhost:5000/cart/${userId}`, { items: updatedCart });
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      } catch (err) {
        console.error("Error saving cart to server:", err.response?.data || err.message);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      }
    } else {
      localStorage.setItem("cart_guest", JSON.stringify(updatedCart));
    }
  };

  const addToCart = (itemId, data) => {
    const menuItem = menuItems.find((m) => m._id === itemId);
    if (!menuItem) return;

    const newItem = {
      menuItemId: itemId,
      name: menuItem.name,
      quantity: parseInt(data[`quantity_${itemId}`]) || 1,
      specialInstructions: data[`specialInstructions_${itemId}`] || "",
      price: menuItem.price,
    };

    setCart((prevCart) => {
      const updatedCart = prevCart.some((item) => item.menuItemId === itemId)
        ? prevCart.map((item) => (item.menuItemId === itemId ? { ...item, ...newItem } : item))
        : [...prevCart, newItem];
      saveCart(updatedCart);
      navigate("/cart");
      return updatedCart;
    });
  };

  const addToFavorites = (itemId) => {
    if (!decodedToken?.id) {
      alert("⚠️ Please log in to add favorites!");
      return;
    }
    const menuItem = menuItems.find((m) => m._id === itemId);
    if (!menuItem) return;

    const quantityInput = document.getElementById(`quantity_${itemId}`);
    const specialInstructionsInput = document.getElementById(`specialInstructions_${itemId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    const specialInstructions = specialInstructionsInput ? specialInstructionsInput.value : "";

    const favoriteItem = { menuItemId: itemId, name: menuItem.name, quantity, specialInstructions, price: menuItem.price };
    const favoritesKey = `favorites_${decodedToken.id}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    if (!favorites.find((fav) => fav.menuItemId === itemId)) {
      favorites.push(favoriteItem);
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
      alert(`${menuItem.name} added to favorites!`);
    } else {
      alert(`${menuItem.name} is already in favorites!`);
    }
  };

  const addToBasket = (itemId) => {
    if (!decodedToken?.id) {
      alert("⚠️ Please log in to add to basket!");
      return;
    }
    const menuItem = menuItems.find((m) => m._id === itemId);
    if (!menuItem) return;

    const quantityInput = document.getElementById(`quantity_${itemId}`);
    const specialInstructionsInput = document.getElementById(`specialInstructions_${itemId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    const specialInstructions = specialInstructionsInput ? specialInstructionsInput.value : "";

    const basketItem = { menuItemId: itemId, name: menuItem.name, quantity, specialInstructions, price: menuItem.price };
    const basketKey = `basket_${decodedToken.id}`;
    const basketItems = JSON.parse(localStorage.getItem(basketKey) || "[]");
    if (!basketItems.find((item) => item.menuItemId === itemId)) {
      basketItems.push(basketItem);
      localStorage.setItem(basketKey, JSON.stringify(basketItems));
      alert(`${menuItem.name} added to basket!`);
    } else {
      alert(`${menuItem.name} is already in your basket!`);
    }
  };

  const goToFavorites = () => navigate("/favorites");
  const goToBasket = () => navigate("/basket");

  const checkOrderStatus = () => {
    if (!orderId) {
      alert("⚠️ Place an order first!");
      return;
    }
    navigate(`/order-status/${orderId}`);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="order-bg">
      <div className="order-page">
        <div className="header-icons">
          <button className="icon-btn" onClick={goToFavorites} title="Favorites">
            ❤️
          </button>
          <button className="icon-btn" onClick={goToBasket} title="Basket">
            🧺
          </button>
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
              <div key={item._id} className="menu-item">
                <img
                  src={imageMap[item.name] || "/order-images/default.jpg"}
                  alt={item.name}
                  className="menu-item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/order-images/default.jpg";
                  }}
                />
                <p>{item.name} — ${item.price.toFixed(2)}</p>
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
                <button type="button" onClick={handleSubmit((data) => addToCart(item._id, data))}>
                  Add to Cart
                </button>
                <button type="button" className="favorite-btn" onClick={() => addToFavorites(item._id)}>
                  Add to Favorites
                </button>
                <button type="button" className="basket-btn" onClick={() => addToBasket(item._id)}>
                  Add to Basket
                </button>
              </div>
            ))
          ) : (
            <p>No menu items found.</p>
          )}
        </form>
        <div className="order-status-section">
          <button onClick={checkOrderStatus}>Check Order Status</button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;