document.addEventListener("DOMContentLoaded", () => {
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
        document.getElementById("totalProducts").textContent =
          data.totalProducts;
        document.getElementById("totalOrders").textContent = data.totalOrders;
        document.getElementById("totalUsers").textContent = data.totalUsers;
      } else {
        console.error("Failed to load stats");
      }
    })
    .catch((err) => console.error("Error fetching stats:", err));

  // ===== Product Form Submission =====
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const imageInput = document.getElementById("image");
      const price = document.getElementById("price").value;
      const file = imageInput.files[0];
      const messageDiv = document.getElementById("message");
      const submitButton = document.querySelector('button[type="submit"]');

      if (!file) {
        messageDiv.textContent = "Please select an image file.";
        messageDiv.className = "message-error";
        return;
      }

      // Show loading state
      const originalText = submitButton.textContent;
      submitButton.textContent = "Adding Product...";
      submitButton.disabled = true;

      const reader = new FileReader();
      reader.onloadend = async function () {
        try {
          const product = {
            title,
            description,
            imageUrl: reader.result, // Base64 encoded image
            price,
          };

          const response = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });

          const data = await response.json();

          if (data.success) {
            messageDiv.textContent = "Product added successfully!";
            messageDiv.className = "message-success";
            form.reset();
          } else {
            messageDiv.textContent = data.msg || "Failed to add product.";
            messageDiv.className = "message-error";
          }
        } catch (error) {
          console.error("Error adding product:", error);
          messageDiv.textContent = "Server error. Please try again.";
          messageDiv.className = "message-error";
        }

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Hide message after 3 seconds
        setTimeout(() => {
          messageDiv.textContent = "";
          messageDiv.className = "";
        }, 3000);
      };

      reader.readAsDataURL(file);
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
