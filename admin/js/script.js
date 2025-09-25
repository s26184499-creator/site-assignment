document.addEventListener("DOMContentLoaded", async () => {
  // ===== Logout Binding =====
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.href = "/index.html";
      }
    });
  }

  // ===== Load Stats =====
  fetch("http://localhost:5000/api/stats")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("totalProducts").textContent = data.totalProducts;
        document.getElementById("totalOrders").textContent = data.totalOrders;
        document.getElementById("totalUsers").textContent = data.totalUsers;
      } else {
        console.error("Failed to load stats");
      }
    })
    .catch((err) => console.error("Error fetching stats:", err));

  // ===== Product Add/Edit =====
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const form = document.getElementById("productForm");
  const submitButton = form?.querySelector('button[type="submit"]');
  const messageDiv = document.getElementById("message");
  const formTitle = document.getElementById("form-title");

  let existingImageUrl = null;

  if (form && productId) {
    // Edit mode
    formTitle.textContent = "Edit Product";
    submitButton.textContent = "Update Product";

    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`);
      const data = await res.json();
      if (data.success) {
        const p = data.product;
        document.getElementById("title").value = p.title;
        document.getElementById("description").value = p.description;
        document.getElementById("price").value = p.price;
        existingImageUrl = p.imageUrl || null;
        document.getElementById("productId").value = productId;
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const price = parseFloat(document.getElementById("price").value);
      const imageInput = document.getElementById("image");
      const file = imageInput.files[0];
      const productId = document.getElementById("productId")?.value;
      const isEdit = Boolean(productId);
      const originalText = submitButton.textContent;

      submitButton.textContent = isEdit ? "Updating..." : "Adding...";
      submitButton.disabled = true;

      const sendData = async (imageUrl) => {
        const payload = { title, description, price };
        if (imageUrl) payload.imageUrl = imageUrl;
        else if (existingImageUrl) payload.imageUrl = existingImageUrl;

        try {
          const response = await fetch(
            isEdit
              ? `http://localhost:5000/api/products/${productId}`
              : "http://localhost:5000/api/products",
            {
              method: isEdit ? "PUT" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const result = await response.json();
          if (result.success) {
            messageDiv.textContent = isEdit
              ? "Product updated successfully!"
              : "Product added successfully!";
            messageDiv.className = "message-success";
            if (!isEdit) form.reset();
            setTimeout(() => (window.location.href = "manageProduct.html"), 1500);
          } else {
            messageDiv.textContent = result.msg || "Failed to save product";
            messageDiv.className = "message-error";
          }
        } catch (err) {
          console.error(err);
          messageDiv.textContent = "Server error";
          messageDiv.className = "message-error";
        }

        submitButton.textContent = originalText;
        submitButton.disabled = false;
        messageDiv.style.display = "block";
        setTimeout(() => (messageDiv.style.display = "none"), 3000);
      };

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => sendData(reader.result);
        reader.onerror = () => {
          messageDiv.textContent = "Error reading file";
          messageDiv.className = "message-error";
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        };
        reader.readAsDataURL(file);
      } else {
        sendData(null);
      }
    });
  }

  // ===== File Input Hover Effects =====
  const fileInput = document.getElementById("image");
  if (fileInput) {
    fileInput.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.style.borderColor = "#764ba2";
      this.style.background = "rgba(118, 75, 162, 0.1)";
    });
    fileInput.addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.style.borderColor = "#667eea";
      this.style.background = "white";
    });
    fileInput.addEventListener("drop", function (e) {
      e.preventDefault();
      this.style.borderColor = "#667eea";
      this.style.background = "white";
    });
  }
});
