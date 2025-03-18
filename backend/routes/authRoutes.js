const express = require("express");
const { registerUser, loginUser, forgotPassword, logoutUser } = require("../controllers/authController");

const router = express.Router();

// ✅ Register, Login, Logout
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ Forgot Password (Reset Password)
router.post("/forgot-password", forgotPassword);

module.exports = router;
