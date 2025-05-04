const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// ✅ Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const reservationRoutes = require("./routes/ReservationRoutes");
const tableRoutes = require("./routes/TableRoutes");
const contactRoutes = require('./routes/contactRoutes');



const orderRecommendationsRoutes = require("./routes/orderRecommendations"); // ✅ Newly added

//  Load environment variables
dotenv.config();

//  Connect to MongoDB
connectDB();

const app = express();

//  CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend access
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};


//  Middleware
app.use(cors());
app.use(express.json());

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/reservations", reservationRoutes);
app.use("/api/tables", tableRoutes);



app.use("/menu", menuRoutes);
app.use("/promotion", promotionRoutes);
app.use("/orders", orderRoutes);
app.use("/orders/recommendations", orderRecommendationsRoutes); // ✅ Added this line
app.use("/api/menus", menuRoutes); // ✅ Correct
app.use("/api/promotions", promotionRoutes);
app.use('/orders', orderRoutes);

//cuntact us 
app.use('/api/contact', contactRoutes);

//shevi
const OrderRoutes = require("./routes/recentOrders");
app.use("/recent-orders", OrderRoutes); // Your route prefix

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//
require("./utils/reservationCleaner");

// Make uploads folder publicly accessible
app.use("/uploads", express.static("uploads"));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
