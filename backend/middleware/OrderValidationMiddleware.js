// middleware/OrderValidationMiddleware.js
const validateOrderFields = (req, res, next) => {
    const { customerId, items, paymentMethod } = req.body;
    if (!customerId || !Array.isArray(items) || !paymentMethod) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    next();
};

module.exports = validateOrderFields;
