const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userEmail: { type: String },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            qty: Number,
            priceAtPurchase: Number
        }
    ],
    total: Number,
    customerName: String,
    customerEmail: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
