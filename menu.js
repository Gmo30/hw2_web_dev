export const menuItems = [
    {
        id: 1,
        name: "Premium Jasmine Milk Tea",
        price: 6.99,
        description: "Freshly picked double-petal jasmine from Hengzhou is infused into high-mountain tea through a meticulous seven-step scenting process. Blended with premium milk, the result is a sweet, delicate, and refreshing taste with a long-lasting floral aroma.",
        image: "images/jasmine_mt.png"
    },
    {
        id: 2,
        name: "White Champaca Milk Tea",
        price: 6.99,
        description: "Mengding high mountain tea from Ya'an, Sichuan, scented with fresh flowers — only the elegant aroma of orchids remains. Delicately fragrant with a lingering finish, blended with premium milk for a fresh, mellow, and silky-smooth taste.",
        image: "images/champaca_mt.png"
    },
    {
        id: 3,
        name: "Osmanthus Milk Tea",
        price: 6.99,
        description: "High-mountain mist nurtures the tender Longjing — one bud, one leaf — gently blended with golden osmanthus. The tea exudes a bright, refined aroma while the sweet scent of osmanthus lingers.",
        image: "images/osmanthus_mt.png"
    },
    {
        id: 4,
        name: "Jasmine Mango Smoothie",
        price: 7.99,
        description: "Jasmine-scented tea blended into a cool, creamy mango smoothie with fresh sweet mango, juicy grapefruit, and smooth coconut milk. Packed with abundant fruit pulp, every sip delivers a natural fruity texture.",
        image: "images/mango.webp"
    }
];

let cart = [];
let cartOpen = false;

function renderMenu() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;

    grid.innerHTML = menuItems.map(item => `
        <div class="menu-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="card-body">
                <div class="card-name">${item.name}</div>
                <div class="card-price">$${item.price.toFixed(2)}</div>
                <div class="card-desc">${item.description}</div>
                <div class="card-footer">
                    <button class="add-btn" id="add-btn-${item.id}" onclick="addToCart(${item.id})">
                        + Add to Order
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

window.addToCart = function(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    flashAddBtn(id);
    showToast(`${item.name} added`);
    renderCart();
    updateBadge();
};

window.changeQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    renderCart();
    updateBadge();
};

window.removeFromCart = function(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
    updateBadge();
};

window.clearCart = function() {
    cart = [];
    renderCart();
    updateBadge();
};

function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
    const itemsEl = document.getElementById("cartItems");
    const footerEl = document.getElementById("cartFooter");

    if (cart.length === 0) {
        itemsEl.innerHTML = `<div class="cart-empty">Your order is empty.<br>Add something to begin.</div>`;
        footerEl.style.display = "none";
        return;
    }

    itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
        </div>
    `).join("");

    document.getElementById("cartTotal").textContent = "$" + getTotal().toFixed(2);
    footerEl.style.display = "block";
}

window.toggleCart = function() {
    cartOpen = !cartOpen;

    document.getElementById("cartPanel").classList.toggle("open", cartOpen);
    document.getElementById("menu-grid").classList.toggle("cart-open", cartOpen);

    const overlay = document.getElementById("cartOverlay");
    overlay.style.display = cartOpen ? "block" : "none";
    // slight delay so display:block registers before the opacity transition
    requestAnimationFrame(() => overlay.classList.toggle("show", cartOpen));
};

function updateBadge() {
    const total = getTotalItems();
    const badge = document.getElementById("cartBadge");
    badge.textContent = total;
    badge.classList.toggle("hidden", total === 0);
}

function flashAddBtn(id) {
    const btn = document.getElementById(`add-btn-${id}`);
    if (!btn) return;
    btn.textContent = "✓ Added";
    btn.classList.add("added");
    setTimeout(() => {
        btn.textContent = "+ Add to Order";
        btn.classList.remove("added");
    }, 1200);
}

let toastTimer;
function showToast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
}

renderMenu();
renderCart();