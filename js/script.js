// Product data for dynamic content
const products = {
  1: {
    name: "Latest Smartphone",
    price: "$799",
    image: "",
    description:
      "This high-performance smartphone features a stunning display, advanced camera system, and lightning-fast processor. Perfect for photography, gaming, and productivity. With 5G connectivity and all-day battery life, it's the ultimate mobile companion.",
    features: [
      '6.7" OLED Display',
      "Triple Camera System",
      "5G Connectivity",
      "All-day Battery Life",
      "Water Resistant",
    ],
  },
  2: {
    name: "Gaming Laptop",
    price: "$1299",
    image: "https://via.placeholder.com/500x400/2196F3/white?text=Laptop",
    description:
      "Experience ultimate gaming performance with this powerful laptop. Featuring a high-end graphics card, fast processor, and advanced cooling system. Perfect for gaming, content creation, and professional work.",
    features: [
      "Intel Core i7 Processor",
      "NVIDIA RTX Graphics",
      "16GB RAM",
      "512GB SSD Storage",
      "144Hz Display",
    ],
  },
  3: {
    name: "Wireless Headphones",
    price: "$199",
    image: "https://via.placeholder.com/500x400/FF9800/white?text=Headphones",
    description:
      "Premium wireless headphones with industry-leading noise cancellation. Enjoy crystal-clear audio quality and comfortable all-day wear. Perfect for music, calls, and travel.",
    features: [
      "Active Noise Cancellation",
      "30-hour Battery Life",
      "Bluetooth 5.0",
      "Quick Charge",
      "Comfortable Design",
    ],
  },
  4: {
    name: "Smartwatch",
    price: "$399",
    image: "https://via.placeholder.com/500x400/9C27B0/white?text=Smartwatch",
    description:
      "Stay connected and track your health with this advanced smartwatch. Features comprehensive health monitoring, GPS, and seamless smartphone integration.",
    features: [
      "Heart Rate Monitor",
      "GPS Tracking",
      "Water Resistant",
      "7-day Battery Life",
      "Fitness Tracking",
    ],
  },
  5: {
    name: "Tablet Pro",
    price: "$699",
    image: "https://via.placeholder.com/500x400/F44336/white?text=Tablet",
    description:
      "Professional-grade tablet with stunning display and powerful performance. Perfect for creative work, productivity, and entertainment. Compatible with professional stylus and keyboard.",
    features: [
      '12.9" Retina Display',
      "Apple M1 Chip",
      "All-day Battery",
      "USB-C Connectivity",
      "Apple Pencil Support",
    ],
  },
  6: {
    name: "Smart Speaker",
    price: "$149",
    image: "https://via.placeholder.com/500x400/607D8B/white?text=Speaker",
    description:
      "Voice-controlled smart speaker with premium sound quality. Control your smart home, play music, and get information with simple voice commands.",
    features: [
      "Voice Control",
      "Premium Audio",
      "Smart Home Hub",
      "Multi-room Audio",
      "Privacy Controls",
    ],
  },
  7: {
    name: "Digital Camera",
    price: "$899",
    image: "https://via.placeholder.com/500x400/795548/white?text=Camera",
    description:
      "Professional-grade digital camera with advanced features for photography enthusiasts. Capture stunning photos and 4K videos with exceptional quality.",
    features: [
      "24MP Sensor",
      "4K Video Recording",
      "Image Stabilization",
      "Wi-Fi Connectivity",
      "Professional Lenses",
    ],
  },
  8: {
    name: "Drone with Camera",
    price: "$549",
    image: "https://via.placeholder.com/500x400/FF5722/white?text=Drone",
    description:
      "High-tech drone with 4K camera and advanced flight features. Perfect for aerial photography, videography, and exploration. GPS navigation and obstacle avoidance included.",
    features: [
      "4K Camera",
      "GPS Navigation",
      "Obstacle Avoidance",
      "30-min Flight Time",
      "Remote Control",
    ],
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const page = window.location.pathname.split("/").pop();

  if (page === "product.html") {
    renderProductDetails();
    setupAddToCart();
  } else if (page === "register.html") {
    setupRegister();
  } else if (page === "login.html") {
    setupLogin();
  }

  updateLoginStatus(); // Always run to show user name if logged in
});

// =====================
// Product Page Logic
// =====================
function renderProductDetails() {
  const id = new URLSearchParams(window.location.search).get("id");
  const product = products?.[id];
  if (!product) return;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("productDescription").textContent =
    product.description;

  const imgUrl =
    new URLSearchParams(window.location.search).get("img") || product.image;
  const productImage = document.getElementById("productImage");
  productImage.src = decodeURIComponent(imgUrl);
  productImage.alt = product.name;

  const featuresList = document.getElementById("productFeatures");
  featuresList.innerHTML = "";
  product.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    featuresList.appendChild(li);
  });
}

function setupAddToCart() {
  const btn = document.getElementById("addToCartBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products?.[id];
    const qty = parseInt(document.getElementById("quantity").value) || 1;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id,
        name: product.name,
        price: parseFloat(product.price.replace("$", "")),
        image: product.image,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${qty} x ${product.name} added to cart!`);
  });
}

// =====================
// Register Page Logic
// =====================
function setupRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    let valid = true;

    document.getElementById("nameError").textContent =
      name.length >= 2 ? "" : "Name must be at least 2 characters.";
    valid &= name.length >= 2;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    document.getElementById("emailError").textContent = emailRegex.test(email)
      ? ""
      : "Invalid email format.";
    valid &= emailRegex.test(email);

    document.getElementById("passwordError").textContent =
      password.length >= 6 ? "" : "Password must be at least 6 characters.";
    valid &= password.length >= 6;

    if (!valid) return;

    if (localStorage.getItem(email)) {
      alert("User already registered with this email.");
      return;
    }

    localStorage.setItem(email, JSON.stringify({ name, email, password }));
    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
  });
}

// =====================
// Login Page Logic
// =====================
function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    document.getElementById("loginEmailError").textContent = emailRegex.test(
      email
    )
      ? ""
      : "Invalid email format.";
    valid &= emailRegex.test(email);

    document.getElementById("loginPasswordError").textContent =
      password.length >= 6 ? "" : "Password must be at least 6 characters.";
    valid &= password.length >= 6;

    if (!valid) return;

    const storedUser = JSON.parse(localStorage.getItem(email));
    if (!storedUser) {
      alert("No account found. Please register.");
      return;
    }

    if (storedUser.password !== password) {
      alert("Incorrect password.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
    alert(`Welcome, ${storedUser.name}!`);
    window.location.href = "index.html";
  });
}

// =====================
// Login Status Handler
// =====================
function updateLoginStatus() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginLink = document.getElementById("loginLink");
  if (user && loginLink) {
    loginLink.textContent = user.name;
    loginLink.href = "#";
    loginLink.addEventListener("click", () => {
      if (confirm("Logout?")) {
        localStorage.removeItem("loggedInUser");
        window.location.reload();
      }
    });
  }
}
