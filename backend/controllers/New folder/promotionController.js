const Menu = require("../models/menuModel");

// ✅ Add or Update a Promotion for a Menu Item
exports.addOrUpdatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const { discountRate, startDate, endDate } = req.body;

        const updatedMenu = await Menu.findByIdAndUpdate(
            id,
            {
                promotion: { discountRate, startDate, endDate },
            },
            { new: true }
        );

        if (!updatedMenu) return res.status(404).json({ message: "Menu item not found" });

        // ✅ Calculate the actual price before sending response
        const actualPrice = updatedMenu.getActualPrice();

        res.json({
            message: "Promotion added/updated successfully",
            menu: {
                ...updatedMenu._doc,
                actualPrice, // ✅ Send updated price with promotion applied
            },
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ Remove a Promotion from a Menu Item
exports.removePromotion = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedMenu = await Menu.findByIdAndUpdate(id, {
            promotion: { discountRate: 0, startDate: null, endDate: null },
        }, { new: true });

        if (!updatedMenu) return res.status(404).json({ message: "Menu item not found" });

        res.json({ message: "Promotion removed successfully", menu: updatedMenu });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
