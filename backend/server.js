const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const menuRoutes = require("./routes/menuRoutes");
const promotionRoutes = require("./routes/promotionRoutes");


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

//routes
app.get("/", (req, res) => res.send("API is running..."));

app.use("/menu", menuRoutes);
app.use("/promotion", promotionRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));