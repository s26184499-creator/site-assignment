const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const tbody = document.querySelector("#cartTable tbody");
const totalDisplay = document.getElementById("cartTotal");

let total = 0;

if (cartItems.length === 0) {
  tbody.innerHTML =
    '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Your cart is empty.</td></tr>';
} else {
  cartItems.forEach((item) => {
    const subtotal = item.quantity * item.price;
    total += subtotal;

    const row = document.createElement("tr");
    //   <td><img src="${item.image}" alt="${item.name}"></td>
    row.innerHTML = `
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>$${subtotal.toFixed(2)}</td>
        `;
    tbody.appendChild(row);
  });
}

totalDisplay.textContent = `$${total.toFixed(2)}`;
