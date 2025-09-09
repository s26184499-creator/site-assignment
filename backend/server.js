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
      userType: userType || "customer"  // Default to "customer"
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
      user.userType === "admin" ? "/admin/dashboard.html" : "/index.html";

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
  const products = await Product.find();
  res.json(products);
});

// Add product (optional, for admin)
app.post("/api/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ msg: "Product added", product: newProduct });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
