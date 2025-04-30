const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ["Appetizers", "Main Courses", "Salads", "Desserts", "Vine Selection", "Signature Cocktails"] 
    },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String }, // Image URL
    promotion: {
        discountRate: { type: Number, default: 0 }, // Percentage (e.g., 20% discount)
        startDate: { type: Date },
        endDate: { type: Date },
    },
}, { timestamps: true });

// ✅ Calculate Actual Price with Promotion
// done actual price 
menuSchema.methods.getActualPrice = function () {
    const now = new Date();
    if (this.promotion && this.promotion.startDate && this.promotion.endDate) {
        if (now >= this.promotion.startDate && now <= this.promotion.endDate) {
            return this.price - (this.price * (this.promotion.discountRate / 100));
        }
    }
    return this.price;
};

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
