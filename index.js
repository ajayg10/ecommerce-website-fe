// ------------------------------
// IMPORTS & INITIAL SETUP
// ------------------------------
import express from 'express';
import jwt from 'jsonwebtoken';         // For signing + verifying JWT auth tokens
import dotenv from 'dotenv';            // For loading environment variables
import bcrypt from 'bcrypt';            // For hashing + verifying passwords
import { connectDB } from './db.js';    // MongoDB connection function
import { User, Product, Cart, Order } from './schema.js';  // All DB models
import cors from 'cors';           // To enable CORS

// Load variables from .env → makes SECRET_KEY, MONGO_URI available in process.env
dotenv.config();

// Fail the application immediately if required secrets are missing
if (!process.env.SECRET_KEY) {
  console.error("FATAL ERROR: SECRET_KEY is not defined in .env");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

const SECRET_KEY = process.env.SECRET_KEY;

// Create express server instance
const Server = express();
Server.use(express.json());  // Allows Express to parse JSON request bodies


const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5174';
Server.use(cors({
  origin: allowedOrigin,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));


// ------------------------------
// PUBLIC ROUTES (No Auth Required)
// ------------------------------

// Test route to confirm server is running
Server.get('/', (req, res) => {
  res.send('Home route is running');
});


// -----------------------------------------
// USER REGISTRATION — Creates new user
// -----------------------------------------
Server.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    console.log("REGISTER: created user id=", user._id.toString());
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Error in registering user", detail: err.message });
  }
});



// -----------------------------------------
// LOGIN — Validates user + returns JWT token
// -----------------------------------------
Server.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "User not found" });

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    // Create JWT token with user info (embedded)
    const token = jwt.sign({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }, SECRET_KEY, { expiresIn: "1h" });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ----------------------------------------------------
// AUTH MIDDLEWARE — Runs BEFORE protected routes below
// ----------------------------------------------------
Server.use(async (req, res, next) => {
  try {
    // These routes DO NOT require JWT token
    const publicPaths = ['/', '/register', '/login', '/all_products', '/products'];
    if (publicPaths.includes(req.path)) return next();

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    // Accept both:
    // "Authorization: Bearer <token>" OR "Authorization: <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token)
      return res.status(401).json({ message: "Malformed authorization header" });

    // Verify token and decode user details
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach decoded user info to request object
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };

    next();  // Continue to protected route

  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
});


// ------------------------------
// PROTECTED ROUTES (Require Auth)
// ------------------------------

// Returns logged-in user's details
Server.get('/profile', (req, res) => {
  return res.json({
    message: "User Profile",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});


// ---------------------------------------------------------
// ADD PRODUCT — Only sellers can add products
// ---------------------------------------------------------
Server.post('/add_products', async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Role check → only seller can add product
    if (req.user.role !== 'seller')
      return res.status(403).json({ message: "Only sellers can add products" });

    if (!name || price == null)
      return res.status(400).json({ message: "name and price are required" });

    // Assign product to logged-in seller
    const product = await Product.create({
      name,
      price,
      category,
      sellerId: req.user.id
    });

    return res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (err) {
    console.error("add_products error:", err);
    return res.status(500).json({ message: "Error adding product" });
  }
});


// ---------------------------------------------------------
// GET PRODUCTS BY SELLER (Query: /products?sellerId=...)
// ---------------------------------------------------------
Server.get('/products', async (req, res) => {
  try {
    const { sellerId } = req.query;

    if (!sellerId)
      return res.status(400).json({ message: "sellerId is required" });

    const products = await Product.find({ sellerId });

    return res.json({ products });

  } catch (err) {
    console.error("products error:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});


// ---------------------------------------------------------
// GET ALL PRODUCTS (Public Route) 
// ---------------------------------------------------------
Server.get('/all_products', async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({ products });

  } catch (err) {
    console.error("all_products error:", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
});


// ---------------------------------------------------------
// ADD TO CART — Creates cart if not exists, updates quantity
// ---------------------------------------------------------
Server.post('/add_to_cart', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    const qty = parseInt(quantity, 10) || 1;
    if (qty <= 0)
      return res.status(400).json({ message: "quantity must be >= 1" });

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Get user's cart OR create a new one
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: []
      });
    }

    // Check if item already exists
    const itemIndex = cart.items.findIndex(
      it => it.productId.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      // Increase quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Add new product to cart
      cart.items.push({
        productId: product._id,
        quantity: qty
      });
    }

    await cart.save();

    // Populate product info before sending response
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'name price category');

    return res.json({
      message: "Product added to cart",
      cart: populatedCart
    });

  } catch (err) {
    console.error("add_to_cart error:", err);
    return res.status(500).json({ message: "Error adding to cart" });
  }
});


// ---------------------------------------------------------
// VIEW CART — Returns items + total price
// ---------------------------------------------------------
Server.get('/view_cart', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.productId', 'name price category');

    if (!cart || !cart.items.length)
      return res.json({ message: "Cart is empty", cart: { items: [] }, totalPrice: 0 });

    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);

    return res.json({ cart, totalPrice });

  } catch (err) {
    console.error("view_cart error:", err);
    return res.status(500).json({ message: "Error fetching cart" });
  }
});


// ---------------------------------------------------------
// PLACE ORDER — Converts cart → order, clears cart
// ---------------------------------------------------------
Server.post('/place_order', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.productId', 'name price');

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      // Skip if product deleted
      if (!item.productId) continue;

      const qty = item.quantity || 1;
      const price = item.productId.price;

      total += qty * price;
      orderItems.push({
        productId: item.productId._id,
        quantity: qty
      });
    }

    const { address } = req.body;

    // Create the final order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      total,
      address,
      status: "placed"
    });

    // Clear the cart after placing order
    cart.items = [];
    await cart.save();

    // Populate order to return readable data
    const populatedOrder = await Order.findById(order._id)
      .populate('items.productId', 'name price category');

    return res.json({
      message: "Order placed successfully",
      order: populatedOrder
    });

  } catch (err) {
    console.error("place_order error:", err);
    return res.status(500).json({ message: "Error placing order" });
  }
});


// ---------------------------------------------------------
// VIEW ORDERS FOR LOGGED-IN USER
// ---------------------------------------------------------
Server.get('/view_orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name price');

    return res.json({ orders });

  } catch (err) {
    console.error("view_orders error:", err);
    return res.status(500).json({ message: "Error fetching orders" });
  }
});


// ---------------------------------------------------------
// START SERVER (Only after DB connection succeeds)
// ---------------------------------------------------------
const start = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 3000;

    Server.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:3000`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
