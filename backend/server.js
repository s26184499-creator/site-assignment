const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ================== USER AUTH ==================

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType: userType || "customer",
    });

    await newUser.save();
    res.json({ success: true, msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password" });
    }

    const redirectUrl =
      user.userType === "admin" ? "/admin/dashboard.html" : "/index.html";

    res.json({
      success: true,
      username: user.username,
      email: user.email,
      userType: user.userType,
      redirect: redirectUrl,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ================== PRODUCT APIs ==================

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch products" });
  }
});

// Get single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, msg: "Product not found" });
    res.json({ success: true, product }); // <-- always wrap in { success: true }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching product" });
  }
});

// Add new product
app.post("/api/products", async (req, res) => {
  try {
    const { title, description, imageUrl, price } = req.body;
    if (!title || !description || !imageUrl || price === undefined) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
    }

    const newProduct = new Product({ title, description, imageUrl, price });
    await newProduct.save();

    res.json({ success: true, msg: "Product added", product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to add product" });
  }
});

// Update product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { title, description, imageUrl, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, price },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ success: false, msg: "Product not found" });

    res.json({
      success: true,
      msg: "Product updated",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to update product" });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to delete product" });
  }
});

// ================== DASHBOARD STATS ==================
app.get("/api/stats", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({ success: true, totalProducts, totalOrders, totalUsers });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch stats" });
  }
});

// ================== SERVER START ==================
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
