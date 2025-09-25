document.addEventListener("DOMContentLoaded", function () {
  const page = window.location.pathname.split("/").pop();

  // Run feedback form setup if feedback page
  if (page === "feedback.html") {
    setupFeedbackForm();
  }

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
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const form = document.getElementById("productForm");
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const priceInput = document.getElementById("price");
  const imageUrlInput = document.getElementById("imageUrl");
  const productIdInput = document.getElementById("productId");
  const submitButton = form.querySelector("button[type=submit]");

  if (productId) {
    submitButton.textContent = "Update Product";
    productIdInput.value = productId;

    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const product = data.product;
          titleInput.value = product.title;
          descInput.value = product.description;
          priceInput.value = product.price;
          imageUrlInput.value = product.imageUrl || "";
        } else {
          alert("Failed to fetch product data");
        }
      })
      .catch(err => console.error(err));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      price: parseFloat(priceInput.value),
      imageUrl: imageUrlInput.value.trim(),
    };

    try {
      const response = await fetch(
        productId
          ? `http://localhost:5000/api/products/${productId}`
          : "http://localhost:5000/api/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(productId ? "Product updated successfully!" : "Product added successfully!");
        window.location.href = "manageProduct.html";
      } else {
        alert("Operation failed: " + (result.msg || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});


// =====================
// Register Page Logic
// =====================
function setupRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
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

    // Call the backend API instead of using localStorage
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.msg); // "User registered successfully"
        window.location.href = "login.html";
      } else {
        alert(data.msg || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration");
    }
  });
}

// =====================
// Login Page Logic
// =====================
function setupLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save login state in localStorage (session handling)
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            username: data.username,
            email: data.email,
            userType: data.userType,
          })
        );

        alert("Login successful!");
        window.location.href = data.redirect; // Redirect after login
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login");
    }
  });
}

// =====================
// Login Status Handler
// =====================
function updateLoginStatus() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginLink = document.getElementById("loginLink");

  if (user && loginLink) {
    loginLink.textContent = user.username;
    loginLink.href = "#";
    loginLink.addEventListener("click", () => {
      if (confirm("Logout?")) {
        localStorage.removeItem("loggedInUser");
        window.location.reload();
      }
    });
  }
}

// --------------------
// Function for feedback form validation
// --------------------
function setupFeedbackForm() {
  const form = document.getElementById("feedbackForm");
  if (!form) return; // guard in case form isn't on the page

  const submitBtn = form.querySelector(".submit-btn");
  const requiredFields = [
    document.getElementById("name"),
    document.getElementById("email"),
    document.getElementById("message"),
  ];

  const checkbox = document.getElementById("newsletter"); // add your required checkbox

  // Disable button initially
  disableButton(submitBtn);

  function checkFormValidity() {
    let allFilled = requiredFields.every((field) => field.value.trim() !== "");
    let checkboxChecked = checkbox && checkbox.checked;

    if (allFilled && checkboxChecked) {
      enableButton(submitBtn);
    } else {
      disableButton(submitBtn);
    }
  }

  // Add listeners
  requiredFields.forEach((field) => {
    field.addEventListener("input", checkFormValidity);
  });

  if (checkbox) {
    checkbox.addEventListener("change", checkFormValidity);
  }

  // Run once in case of autofill
  checkFormValidity();
}

// --------------------
// Utility functions
// --------------------
function disableButton(btn) {
  btn.disabled = true;
  btn.style.opacity = "0.6";
  btn.style.cursor = "not-allowed";
}

function enableButton(btn) {
  btn.disabled = false;
  btn.style.opacity = "1";
  btn.style.cursor = "pointer";
}

const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");

// Handle star click
stars.forEach((star) => {
  star.addEventListener("click", () => {
    let ratingValue = star.getAttribute("data-rating");
    rating.value = ratingValue;

    stars.forEach((s, index) => {
      s.style.color = index < ratingValue ? "#bfc22a" : "#333";
    });

    localStorage.setItem("rating", ratingValue);
  });

  // Hover effect
  star.addEventListener("mouseenter", () => {
    let hoverValue = star.getAttribute("data-rating");
    stars.forEach((s, index) => {
      s.style.color = index < hoverValue ? "#bfc22a" : "#333";
    });
  });

  star.addEventListener("mouseleave", () => {
    let crunchRating = rating.value;
    stars.forEach((s, index) => {
      s.style.color = index < crunchRating ? "#bfc22a" : "#333";
    });
  });
});

// Submit button
// const submit = document.querySelector(".submit-btn");
// submit.addEventListener("click", (Event) => {
//   Event.preventDefault();
//   alert("Thank you for your Feedback!");
// });

// Handle form reset to reset star colors
const feedbackForm = document.getElementById("feedbackForm");

// feedbackForm.addEventListener("reset", () => {
  // Set hidden rating input back to 0
  // rating.value = 0;

  // Reset all stars to default color
  // stars.forEach((s) => {
  //   s.style.color = "#333"; // unfilled color
  // });

  // (Optional) clear saved rating in localStorage too
  // localStorage.removeItem("rating");
// });

// Display products in the grid

