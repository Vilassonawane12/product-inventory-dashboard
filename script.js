// Product Inventory & Analytics Dashboard
// The starting products are the same ones used in the assignment sheet.
const inventory = [
  { name: "Laptop", price: 800 },
  { name: "Mouse", price: 25 }
];

// A switch statement is used to assign one of three categories.
function getCategory(price) {
  let category;
  switch (true) {
    case price < 50: category = "Budget"; break;
    case price < 500: category = "Standard"; break;
    default: category = "Premium";
  }
  return category;
}

// Regular function: total price of products currently in the array.
function calculateTotal(products) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].price;
  }
  return total;
}

// Arrow function: adds optional tax and applies a percentage discount.
const calculateAdjustedTotal = (amount, tax = 0, discount = 0) => {
  const afterTax = amount + (amount * tax / 100);
  return afterTax - (afterTax * discount / 100);
};

function readPrice(text) {
  if (String(text).trim() === "") return null;
  const value = Number(text); // Explicit type conversion from user text
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function addProduct(nameInput, priceInput) {
  const name = String(nameInput ?? "").trim();
  const price = readPrice(priceInput);
  if (!name || price === null) return "Enter a product name and a valid price (zero or above).";
  // Check for duplicates with a loop. continue skips any empty names.
  for (let i = 0; i < inventory.length; i++) {
    if (!inventory[i].name) continue;
    if (inventory[i].name.toLowerCase() === name.toLowerCase()) return "This product is already in the inventory.";
  }
  inventory.push({ name, price });
  render();
  printReport();
  return `${name} was added successfully.`;
}

function findProduct(searchTerm) {
  const term = String(searchTerm ?? "").trim().toLowerCase();
  if (!term) return null;
  let position = 0;
  while (position < inventory.length) {
    const product = inventory[position];
    position++;
    if (!product.name) continue;
    if (product.name.toLowerCase() === term) return product; // break out by returning
  }
  return null;
}

function printReport() {
  console.log("--- Processing Inventory Roster (forEach) ---");
  inventory.forEach(product => console.log(`* Item: ${product.name} ($${product.price}) -> Category: ${getCategory(product.price)}`));
  const affordable = inventory.filter(product => product.price < 200);
  const report = inventory.map(product => `${product.name.toUpperCase()}: $${product.price}`);
  console.log("\n--- Financial Analytics ---");
  console.log(`Total Inventory Value: $${calculateTotal(inventory)}`);
  console.log("Filtered Affordable Items (Under $200):", affordable.map(p => p.name));
  console.log("Formatted Report List:", report);
}

function render() {
  document.querySelector("#count").textContent = inventory.length;
  document.querySelector("#total").textContent = `$${calculateTotal(inventory).toFixed(2)}`;
  const affordable = inventory.filter(product => product.price < 200);
  document.querySelector("#affordable").textContent = affordable.length;
  document.querySelector("#affordableItems").textContent = affordable.map(product => product.name).join(", ") || "No items found";
  const tbody = document.querySelector("#inventoryRows");
  tbody.replaceChildren();
  inventory.forEach(product => {
    const row = document.createElement("tr");
    [product.name, `$${product.price.toFixed(2)}`, getCategory(product.price)].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
}

// Inputs can be collected from the page or from native prompt() boxes.
document.querySelector("#addBtn").addEventListener("click", () => {
  const message = addProduct(document.querySelector("#productName").value, document.querySelector("#productPrice").value);
  document.querySelector("#message").textContent = message;
});
document.querySelector("#promptBtn").addEventListener("click", () => {
  const name = prompt("Enter product name:", "Monitor");
  if (name === null) return;
  const priceText = prompt("Enter product price:", "150");
  if (priceText === null) return;
  console.log(`[Prompt executed: User adds "${name}" at "$${priceText}"]`);
  document.querySelector("#message").textContent = addProduct(name, priceText);
});
document.querySelector("#searchBtn").addEventListener("click", () => {
  const input = document.querySelector("#searchName").value;
  const item = findProduct(input);
  document.querySelector("#searchResult").textContent = item ? `${item.name}: $${item.price} (${getCategory(item.price)})` : "Product not found. Please check the spelling.";
});
document.querySelector("#calculateBtn").addEventListener("click", () => {
  const tax = readPrice(document.querySelector("#tax").value);
  const discount = readPrice(document.querySelector("#discount").value);
  const result = document.querySelector("#adjustedTotal");
  if (tax === null || discount === null || discount > 100) {
    result.textContent = "Enter a valid tax and discount (discount cannot be above 100%).";
    return;
  }
  result.textContent = `Total after tax and discount: $${calculateAdjustedTotal(calculateTotal(inventory), tax, discount).toFixed(2)}`;
});
document.querySelector("#reportBtn").addEventListener("click", printReport);
console.log("--- Initializing Inventory System ---");
render();
printReport();
