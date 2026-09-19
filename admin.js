/**
 * CHYRIS FINE JEWELLERY — Admin JavaScript Controller
 */

const defaultProducts = [
  { id: 1, name: "Diamond Solitaire Ring", category: "Rings", price: "₹45,000" },
  { id: 2, name: "Classic Tennis Bracelet", category: "Bracelets", price: "₹82,000" }
];

window.addEventListener("DOMContentLoaded", () => {
  let activeUser = JSON.parse(localStorage.getItem('chyris_active_user')) || JSON.parse(localStorage.getItem('orven_active_user'));
  
  if (!activeUser || activeUser.role !== 'admin') {
    alert('Unauthorized access! Please login with admin credentials first.');
    window.location.href = 'index.html';
  } else {
    document.getElementById('adminNameDisplay').innerText = `Logged in as: ${activeUser.name}`;
  }
  loadAdminInventory();
});

function loadAdminInventory() {
  let products = JSON.parse(localStorage.getItem('chyris_admin_products')) || JSON.parse(localStorage.getItem('orven_admin_products'));
  if (!products) {
    products = defaultProducts;
    localStorage.setItem('chyris_admin_products', JSON.stringify(products));
  }

  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td>
        <button class="btn-action" onclick="openEditModal(event, ${p.id})">Edit</button>
        <button class="btn-action btn-delete" onclick="deleteProduct(event, ${p.id})">Remove</button>
      </td>
    `;
    tr.onclick = () => alert(`Product Details:\nName: ${p.name}\nCategory: ${p.category}\nPrice: ${p.price}`);
    tbody.appendChild(tr);
  });
}

function openProductModal() {
  document.getElementById('modalTitle').innerText = "Add New Product";
  document.getElementById('editProductId').value = "";
  document.getElementById('prodNameInput').value = "";
  document.getElementById('prodCategorySelect').value = "Rings";
  document.getElementById('prodPriceInput').value = "";
  document.getElementById('productModal').style.display = "flex";
}

function openEditModal(event, id) {
  event.stopPropagation();
  let products = JSON.parse(localStorage.getItem('chyris_admin_products')) || JSON.parse(localStorage.getItem('orven_admin_products')) || defaultProducts;
  let prod = products.find(p => p.id === id);
  if (!prod) return;

  document.getElementById('modalTitle').innerText = "Edit Product";
  document.getElementById('editProductId').value = prod.id;
  document.getElementById('prodNameInput').value = prod.name;
  document.getElementById('prodCategorySelect').value = prod.category;
  document.getElementById('prodPriceInput').value = prod.price.replace('₹', '').replace(/,/g, '');
  document.getElementById('productModal').style.display = "flex";
}

function closeProductModal() {
  document.getElementById('productModal').style.display = "none";
}

function saveProduct() {
  let id = document.getElementById('editProductId').value;
  let name = document.getElementById('prodNameInput').value.trim();
  let category = document.getElementById('prodCategorySelect').value;
  let priceVal = document.getElementById('prodPriceInput').value.trim();

  if (!name || !priceVal) {
    alert("Please fill in all product fields.");
    return;
  }

  let formattedPrice = priceVal.startsWith('₹') ? priceVal : '₹' + Number(priceVal).toLocaleString('en-IN');
  let products = JSON.parse(localStorage.getItem('chyris_admin_products')) || JSON.parse(localStorage.getItem('orven_admin_products')) || defaultProducts;

  if (id) {
    let prod = products.find(p => p.id == id);
    if (prod) {
      prod.name = name;
      prod.category = category;
      prod.price = formattedPrice;
    }
  } else {
    let newProd = {
      id: Date.now(),
      name: name,
      category: category,
      price: formattedPrice
    };
    products.push(newProd);
  }

  localStorage.setItem('chyris_admin_products', JSON.stringify(products));
  closeProductModal();
  loadAdminInventory();
  alert("Product saved successfully!");
}

function deleteProduct(event, id) {
  event.stopPropagation();
  if (confirm("Are you sure you want to remove this product from inventory?")) {
    let products = JSON.parse(localStorage.getItem('chyris_admin_products')) || JSON.parse(localStorage.getItem('orven_admin_products')) || defaultProducts;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('chyris_admin_products', JSON.stringify(products));
    loadAdminInventory();
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const targetTab = document.getElementById('tab-' + tabId);
  const targetNav = document.getElementById('nav-' + tabId);
  
  if (targetTab) targetTab.classList.add('active');
  if (targetNav) targetNav.classList.add('active');
}

function logoutAdmin() {
  localStorage.removeItem('chyris_active_user');
  localStorage.removeItem('orven_active_user');
  window.location.href = 'index.html';
}
