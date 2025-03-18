const Menu = require("../models/menuModel");

// ✅ Add a new menu item
exports.addMenu = async (req, res) => {
    try {
        const { name, category, description, price, image } = req.body;

        // Validate category
        const validCategories = ["Appetizers", "Main Courses", "Salads", "Desserts", "Wine Selection", "Signature Cocktails"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const newMenu = new Menu({ name, category, description, price, image });

        await newMenu.save();
        res.status(201).json({ message: "Menu item added successfully", menu: newMenu });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all menu items (with filtering by category or name)
exports.getMenus = async (req, res) => {
    try {
        let { category, name } = req.query;
        let query = {};

        if (category) query.category = category;
        if (name) query.name = new RegExp(name, "i"); // Case-insensitive search

        let menus = await Menu.find(query);

        // ✅ Attach actual price dynamically
        menus = menus.map(menu => ({
            ...menu._doc,
            actualPrice: menu.getActualPrice(),
        }));

        res.json(menus);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update a menu item
exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMenu = await Menu.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedMenu) return res.status(404).json({ message: "Menu item not found" });

        res.json({ message: "Menu updated successfully", menu: updatedMenu });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a menu item
exports.deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMenu = await Menu.findByIdAndDelete(id);

        if (!deletedMenu) return res.status(404).json({ message: "Menu item not found" });

        res.json({ message: "Menu item deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
