const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require("../controllers/menuController");

// Setup Multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/add", upload.single("image"), menuController.addMenu);
router.get("/all", menuController.getMenus);

// ✅ FIXED: Ensure image uploads are handled on update
router.put("/update/:id", upload.single("image"), menuController.updateMenu);

router.delete("/delete/:id", menuController.deleteMenu);
router.get("/promotions/report", menuController.getPromotionsReport);

module.exports = router;
