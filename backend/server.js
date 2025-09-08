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
mongoose.connect("mongodb://localhost:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log(err));

// Registration API
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });
  await newUser.save();
  res.json({ msg: "User registered successfully" });
});

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ success: true, username: user.username, email: user.email });
  } else {
    res.status(401).json({ success: false, msg: "Invalid email or password" });
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
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
