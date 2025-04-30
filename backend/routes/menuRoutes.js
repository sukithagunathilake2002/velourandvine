const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require("../controllers/menuController");

// Set up Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Create this folder if it doesn't exist
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Add menu with image upload
router.post("/add", upload.single("image"), menuController.addMenu);

router.get("/all", menuController.getMenus);
router.put("/update/:id", menuController.updateMenu);
router.delete("/delete/:id", menuController.deleteMenu);

module.exports = router;
