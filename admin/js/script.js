document
  .getElementById("product-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("image");
    const file = imageInput.files[0];
    const messageDiv = document.getElementById("message");

    if (file) {
      // Show loading state
      const submitButton = document.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = "Adding Product...";
      submitButton.disabled = true;

      const reader = new FileReader();
      reader.onloadend = function () {
        const product = {
          id: Date.now(), // Simple ID generation
          title,
          description,
          image: reader.result, // Base64 image
        };

        // Store in memory instead of localStorage for Claude.ai compatibility
        let products = window.products || [];
        products.push(product);
        window.products = products;

        // Show success message
        messageDiv.textContent = "Product added successfully!";
        messageDiv.className = "message-success";

        // Reset form
        document.getElementById("product-form").reset();

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

        // Hide message after 3 seconds
        setTimeout(() => {
          messageDiv.style.display = "none";
          messageDiv.className = "";
        }, 3000);
      };

      reader.onerror = function () {
        messageDiv.textContent = "Error reading file. Please try again.";
        messageDiv.className = "message-error";
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      };

      reader.readAsDataURL(file); // Convert image to base64
    } else {
      messageDiv.textContent = "Please select an image file.";
      messageDiv.className = "message-error";
    }
  });

// Add hover effect to file input
const fileInput = document.getElementById("image");
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
