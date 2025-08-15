const cardInput = document.getElementById("cardNumber");
const cardType = document.getElementById("cardType");

cardInput.addEventListener("input", () => {
  const value = cardInput.value;
  if (/^4/.test(value)) {
    cardType.textContent = "Visa Card detected";
  } else if (/^5/.test(value)) {
    cardType.textContent = "MasterCard detected";
  } else {
    cardType.textContent = "";
  }
});

document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate minimum card length
  if (cardInput.value.length < 16) {
    alert("Card number must be 16 digits");
    return;
  }

  const successMsg = document.getElementById("successMessage");
  successMsg.style.display = "block";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
});

function showSuccessPopup() {
  const popup = document.getElementById("successPopup");
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
    window.location.href = "index.html"; // Redirect after showing
  }, 5000);
}

document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Basic validation
  if (cardInput.value.length < 16) {
    alert("Card number must be 16 digits");
    return;
  }

  // Show success popup
  showSuccessPopup();
});

// 1. Fetch cart data from localStorage
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

const itemTotalElement = document.querySelector(
  ".summary-item:nth-child(2) span:last-child"
);
const shippingElement = document.querySelector(
  ".summary-item:nth-child(3) span:last-child"
);
const totalElement = document.querySelector(
  ".summary-item.total span:last-child"
);

let itemTotal = 0;
cartItems.forEach((item) => {
  itemTotal += item.price * item.quantity;
});

const shippingFee = cartItems.length > 0 ? 25 : 0;
const finalTotal = itemTotal + shippingFee;

// 2. Display totals in the summary section
itemTotalElement.textContent = `$${itemTotal.toFixed(2)}`;
shippingElement.textContent = `$${shippingFee.toFixed(2)}`;
totalElement.textContent = `$${finalTotal.toFixed(2)}`;

// 3. Success popup function
function showSuccessPopup() {
  const popup = document.getElementById("successPopup");
  popup.style.display = "block";

  // Create receipt data
  const receipt = {
    items: cartItems,
    itemTotal: itemTotal.toFixed(2),
    shipping: shippingFee.toFixed(2),
    total: finalTotal.toFixed(2),
    date: new Date().toLocaleString()
  };

  // Save to localStorage
  localStorage.setItem("lastReceipt", JSON.stringify(receipt));

  setTimeout(() => {
    popup.style.display = "none";
    localStorage.removeItem("cart"); // Clear cart
    window.location.href = "receipt.html"; // Go to receipt page
  }, 5000);
}


// 4. Handle fake payment submission
document.getElementById("paymentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  showSuccessPopup();
});
