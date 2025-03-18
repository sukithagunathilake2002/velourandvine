// server.js
const express = require('express');
const connectDB = require('./config/db'); // ✅ Updated path for db.js
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Allows JSON data in requests
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to MongoDB
connectDB();

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('✅ Server is running successfully!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
