import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Product from './schemas/Product.js';
import CartItem from './schemas/CartItem.js';
import Order from './schemas/Order.js';
import User from './schemas/User.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGO_URI;
const MOCK_USER_EMAIL = process.env.MOCK_USER_EMAIL;
const MOCK_USER_NAME = process.env.MOCK_USER_NAME;

// Connect DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        await ensureMockUser();
        await seedProductsIfEmpty();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function ensureMockUser() {
    try {
        let user = await User.findOne({ email: MOCK_USER_EMAIL });
        if (!user) {
            user = await User.create({ name: MOCK_USER_NAME, email: MOCK_USER_EMAIL });
            console.log('Created mock user:', user.email);
        }
    } catch (err) {
        console.error('Error creating mock user:', err);
    }
}

// seedProductsIfEmpty using fake store api
async function seedProductsIfEmpty() {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log(`Products already present: ${count}`);
            return;
        }

        const useFake = String(process.env.USE_FAKESTORE || 'false').toLowerCase() === 'true';
        if (useFake) {
            const FAKESTORE_URL = process.env.FAKESTORE_URL || 'https://fakestoreapi.com/products';
            console.log('Seeding products from Fake Store API:', FAKESTORE_URL);
            try {
                const resp = await fetch(FAKESTORE_URL);
                if (!resp.ok) throw new Error(`Failed to fetch FakeStore: ${resp.status} ${resp.statusText}`);
                const items = await resp.json();
                const mapped = items.map(it => ({
                    name: it.title || it.name || 'Untitled',
                    price: Math.round(Number(it.price || 0)),
                    description: it.description || '',
                    image: it.image || ''
                }));
                if (mapped.length === 0) throw new Error('No products returned from Fake Store API');
                await Product.insertMany(mapped);
                console.log(`Seeded ${mapped.length} products from Fake Store API.`);
                return;
            } catch (err) {
                console.error('Failed to seed from Fake Store API (falling back to static):', err);
            }
        }

        // Static fallback list with image URLs (you can replace URLs with your own)
        console.log('Seeding default static products (with images)');
        const items = [
            { name: 'Wireless Headphones', price: 2499, description: 'Bluetooth over-ear headphones', image: 'https://www.bbassets.com/media/uploads/p/l/40322465_1-portronics-muffs-m2-bluetooth-wireless-headphone-white.jpg' },
            { name: 'USB-C Charger', price: 799, description: 'Fast charging 30W', image: 'https://makmobile.in/cdn/shop/products/imgonline-com-ua-resize-orM31884H0S8.jpg?v=1678192057&width=713' },
            { name: 'Laptop Sleeve 13"', price: 599, description: 'Neoprene sleeve', image: 'https://m.media-amazon.com/images/I/41n6NLjSS7L._SY300_SX300_QL70_FMwebp_.jpg' },
            { name: 'Mechanical Keyboard', price: 3499, description: 'RGB compact keyboard', image: 'https://m.media-amazon.com/images/I/41Y-gsl1xKL._SY300_SX300_QL70_FMwebp_.jpg' },
            { name: 'Smartwatch', price: 6999, description: 'Fitness + Notifications', image: 'https://static.helioswatchstore.com/media/catalog/product/a/1/a1969-bk_1_1_1.jpg' },
            { name: 'Phone Stand', price: 299, description: 'Adjustable phone stand', image: 'https://www.bbassets.com/media/uploads/p/l/40341650_1-portronics-mobot-iii-360-rotatable-foldable-mobile-phone-holder-stable-metallic-base-black.jpg' },
            { name: 'Portable SSD 512GB', price: 5999, description: 'Fast NVMe external SSD', image: 'Portable SSD 512GB' }
        ];
        await Product.insertMany(items);
        console.log('Seeded products:', items.length);
    } catch (err) {
        console.error('Product seeding error:', err);
    }
}





// GET /api/products
app.get('/api/products', async (req, res, next) => {
    try {
        const products = await Product.find().lean();
        res.json({ success: true, products });
    } catch (err) {
        next(err);
    }
});

// POST /api/cart 
app.post('/api/cart', async (req, res, next) => {
    try {
        const { productId, qty } = req.body;
        if (!productId || !qty || qty < 1) {
            return res.status(400).json({ success: false, message: 'productId and qty (>=1) are required' });
        }

        let cartItem = await CartItem.findOne({ userEmail: MOCK_USER_EMAIL, product: productId });
        if (cartItem) {
            cartItem.qty = cartItem.qty + Number(qty);
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({ userEmail: MOCK_USER_EMAIL, product: productId, qty: Number(qty) });
        }
        cartItem = await CartItem.findById(cartItem._id).populate('product').lean();

        res.status(201).json({ success: true, cartItem });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/cart/:id  
app.delete('/api/cart/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const removed = await CartItem.findOneAndDelete({ _id: id, userEmail: MOCK_USER_EMAIL });
        if (!removed) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }
        res.json({ success: true, message: 'Removed', removedId: id });
    } catch (err) {
        next(err);
    }
});

// GET /api/cart  
app.get('/api/cart', async (req, res, next) => {
    try {
        const items = await CartItem.find({ userEmail: MOCK_USER_EMAIL }).populate('product').lean();

        const valid = [];
        const staleIds = [];
        for (const it of items) {
            if (!it.product) {
                staleIds.push(it._id);
            } else {
                valid.push(it);
            }
        }

        if (staleIds.length > 0) {
            try {
                await CartItem.deleteMany({ _id: { $in: staleIds } });
                console.warn(`Removed ${staleIds.length} stale cart items for user ${MOCK_USER_EMAIL}`);
            } catch (cleanupErr) {
                console.error('Failed to remove stale cart items:', cleanupErr);
            }
        }

        const cartItems = valid.map(it => ({
            id: it._id,
            product: {
                id: it.product._id,
                name: it.product.name,
                price: it.product.price,
                description: it.product.description,
                image: it.product.image
            },
            qty: it.qty,
            subtotal: Number((it.qty * it.product.price).toFixed(2))
        }));

        const total = cartItems.reduce((s, i) => s + i.subtotal, 0);
        res.json({ success: true, cartItems, total, removedStaleCount: staleIds.length });
    } catch (err) {
        next(err);
    }
});

// POST /api/checkout
app.post('/api/checkout', async (req, res, next) => {
    try {
        let { cartItems, customerName, customerEmail } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            const persisted = await CartItem.find({ userEmail: MOCK_USER_EMAIL }).populate('product').lean();

            const missing = persisted.filter(it => !it.product).map(it => it._id);
            if (missing.length > 0) {

                return res.status(400).json({
                    success: false,
                    message: 'Some items in your cart are no longer available. Please refresh cart.',
                    missingCartItemIds: missing
                });
            }

            if (!persisted || persisted.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty' });
            }

            cartItems = persisted.map(it => ({ product: it.product._id, qty: it.qty, productDoc: it.product }));
        }

        const detailedItems = [];
        let total = 0;
        for (const ci of cartItems) {
            const pid = ci.productId || ci.product || (ci.product && ci.product._id) || ci.product;
            const qty = Number(ci.qty || ci.qty === 0 ? ci.qty : 1);
            if (!pid || qty < 1) return res.status(400).json({ success: false, message: 'Each cart item needs valid productId and qty >=1' });

            let productDoc = ci.productDoc;
            if (!productDoc) {
                productDoc = await Product.findById(pid).lean();
                if (!productDoc) {
                    return res.status(404).json({ success: false, message: `Product ${pid} not found` });
                }
            }

            const priceAtPurchase = Number(productDoc.price);
            const subtotal = priceAtPurchase * qty;
            total += subtotal;

            detailedItems.push({
                product: productDoc._id,
                qty,
                priceAtPurchase
            });
        }

        // Create order (mock)
        const order = await Order.create({
            userEmail: MOCK_USER_EMAIL,
            items: detailedItems,
            total,
            customerName: customerName || process.env.MOCK_USER_NAME || MOCK_USER_EMAIL,
            customerEmail: customerEmail || process.env.MOCK_USER_EMAIL || MOCK_USER_EMAIL
        });

        // Clear persisted cart for this user
        await CartItem.deleteMany({ userEmail: MOCK_USER_EMAIL });

        const receipt = {
            orderId: order._id,
            total: Number(total.toFixed(2)),
            timestamp: order.createdAt,
            items: detailedItems.map(i => ({ product: i.product, qty: i.qty, priceAtPurchase: i.priceAtPurchase }))
        };

        res.status(201).json({ success: true, receipt });
    } catch (err) {
        next(err);
    }
});


// Error handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
