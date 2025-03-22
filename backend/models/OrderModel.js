// models/OrderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to customer
    items: [
        {
            menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true }, // Reference to menu items
            name: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            specialInstructions: { type: String },
            price: { type: Number, required: true },
            subtotal: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Verifying", "Preparing", "Ready", "Completed", "Cancelled"], // Order status lifecycle
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"], // Payment status
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card"], // Payment method
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Method to calculate the total price based on the order items
orderSchema.methods.calculateTotalPrice = function () {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.subtotal, 0);
    return this.totalPrice;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
