// Display products in the grid
function displayProducts(products) {
  const productsGrid = document.getElementById("products-grid");
  const emptyState = document.getElementById("empty-state");

  productsGrid.innerHTML = ""; // Clear existing products

  if (products.length === 0) {
    productsGrid.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  productsGrid.style.display = "grid";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imageDiv = document.createElement("div");
    imageDiv.className = "product-image";
    imageDiv.style.backgroundImage = `url('${
      product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
    }')`;
    imageDiv.textContent = product.imageUrl ? "" : "📦";

    const titleDiv = document.createElement("div");
    titleDiv.className = "product-title";
    titleDiv.textContent = product.title;

    const descDiv = document.createElement("div");
    descDiv.className = "product-description";
    descDiv.textContent = product.description;

    const priceDiv = document.createElement("div");
    priceDiv.className = "product-price";
    priceDiv.textContent = `$${product.price.toFixed(2)}`;

    card.append(imageDiv, titleDiv, descDiv, priceDiv);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "product-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editProduct(product._id);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteProduct(product._id);

    actionsDiv.append(editBtn, deleteBtn);
    card.appendChild(actionsDiv);

    productsGrid.appendChild(card);
  });
}

// Fetch products from backend API
async function loadProducts() {
  try {
    const response = await fetch("http://localhost:5000/api/products");
    const result = await response.json();

    if (result.success) {
      displayProducts(result.products);
    } else {
      displayProducts([]);
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
    displayProducts([]);
  }
}

function editProduct(id) {
  alert(`Edit product with ID: ${id}`);
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          showMessage("Product deleted successfully!", "success");
          loadProducts();
        } else {
          showMessage("Failed to delete product", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage("Server error", "error");
      });
  }
}

function showMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${
              type === "success"
                ? "linear-gradient(135deg, #2ecc71, #27ae60)"
                : "linear-gradient(135deg, #e74c3c, #c0392b)"
            };
        `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Load products when page loads
document.addEventListener("DOMContentLoaded", loadProducts);
