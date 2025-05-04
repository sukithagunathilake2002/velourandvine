const Menu = require("../models/menuModel");
const path = require("path");

// Add a new menu item
exports.addMenu = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const price = parseFloat(req.body.price);

    // ✅ Save image path in a format usable in frontend (use POSIX-style path)
    const image = req.file ? path.posix.join("uploads", path.basename(req.file.path)) : "";

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Basic validation
    if (!name || !category || !description || isNaN(price)) {
      return res.status(400).json({ message: "Invalid input fields." });
    }

    const validCategories = [
      "Appetizers",
      "Main Courses",
      "Salads",
      "Desserts",
      "Wine Selection",
      "Signature Cocktails",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newMenu = new Menu({
      name,
      category,
      description,
      price,
      image,
    });

    await newMenu.save();

    res.status(201).json({
      message: "Menu item added successfully",
      menu: newMenu,
    });

  } catch (error) {
    console.error("Add menu error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all menu items (with optional filtering)
exports.getMenus = async (req, res) => {
  try {
    let { category, name } = req.query;
    let query = {};

    if (category) query.category = category;
    if (name) query.name = new RegExp(name, "i"); // Case-insensitive

    let menus = await Menu.find(query);

    menus = menus.map(menu => ({
      ...menu._doc,
      actualPrice: menu.getActualPrice(),
    }));

    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a menu item
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Handle image update (optional)
    if (req.file) {
      updatedData.image = path.posix.join("uploads", path.basename(req.file.path));
    }

    const updatedMenu = await Menu.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu updated successfully", menu: updatedMenu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a menu item
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotionsReport = async (req, res) => {
  try {
    const menus = await Menu.find({
      "promotion.discountRate": { $gt: 0 }
    });

    const now = new Date();

    const currentPromotions = menus.filter(menu =>
      menu.promotion.startDate &&
      menu.promotion.endDate &&
      new Date(menu.promotion.startDate) <= now &&
      new Date(menu.promotion.endDate) >= now
    );

    const upcomingPromotions = menus.filter(menu =>
      menu.promotion.startDate &&
      new Date(menu.promotion.startDate) > now
    );

    res.json({ currentPromotions, upcomingPromotions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
