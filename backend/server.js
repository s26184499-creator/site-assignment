const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Product = require("./models/Product");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (local)
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

const bcrypt = require("bcrypt");

// Registration API
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType: userType || "customer", // Default to "customer"
    });

    await newUser.save();

    res.json({ success: true, msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

// Login API
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

    // Determine redirect URL based on user type
    const redirectUrl =
      user.userType === "admin" ? "l̥" : "/index.html";

    res.json({
      success: true,
      username: user.username,
      email: user.email,
      userType: user.userType,
      redirect: redirectUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// Get products API
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products: products,
    });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch products",
    });
  }
});

// Add product (optional, for admin)
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
    console.error("Add product error:", err);
    res.status(500).json({ success: false, msg: "Failed to add product" });
  }
});

// Delete product (optional, for admin)
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, msg: "Failed to delete product" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
