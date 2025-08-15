document.addEventListener("DOMContentLoaded", () => {
  const receipt = JSON.parse(localStorage.getItem("lastReceipt"));

  if (!receipt) {
    document.body.innerHTML = "<h2>No recent receipt found.</h2>";
    return;
  }

  // Display date
  document.getElementById("receipt-date").textContent = `Date: ${receipt.date}`;

  // Table body
  const tbody = document.querySelector("#receipt-table tbody");
  receipt.items.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });

  // Totals
  document.getElementById("item-total").textContent = receipt.itemTotal;
  document.getElementById("shipping").textContent = receipt.shipping;
  document.getElementById("final-total").textContent = receipt.total;
});
