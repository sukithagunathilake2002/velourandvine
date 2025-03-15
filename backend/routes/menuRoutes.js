const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.post("/add", menuController.addMenu);
router.get("/all", menuController.getMenus);
router.put("/update/:id", menuController.updateMenu);
router.delete("/delete/:id", menuController.deleteMenu);

module.exports = router;
