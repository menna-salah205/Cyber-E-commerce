/* =============================================
CYBER STORE — Shared Cart System
============================================= */

const CART_KEY = 'cyber_cart';

function getCart() {
try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
catch { return []; }
}

function saveCart(cart) {
localStorage.setItem(CART_KEY, JSON.stringify(cart));
updateCartBadge();
}

function addToCart(id, name, price, img) {
const cart = getCart();
const existing = cart.find(i => i.id === id);
if (existing) {
    existing.qty += 1;
} else {
    cart.push({ id, name, price, img, qty: 1 });
}
saveCart(cart);
showCartToast(name);
}

function removeFromCart(id) {
saveCart(getCart().filter(i => i.id !== id));
}

function updateQty(id, qty) {
const cart = getCart();
const item = cart.find(i => i.id === id);
if (item) { item.qty = Math.max(1, qty); saveCart(cart); }
}

function cartTotal() {
return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount() {
return getCart().reduce((s, i) => s + i.qty, 0);
}

/* ---------- Badge on cart icon ---------- */

function updateCartBadge() {
document.querySelectorAll('.cart-badge').forEach(b => {
    const count = cartCount();
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
});
}

/* ---------- Toast notification ---------- */

function showCartToast(name) {
let toast = document.getElementById('cyber-toast');
if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.innerHTML = `
    <div class="cyber-toast-inner">
        <i class="fa-solid fa-check-circle"></i>
        <span id="cyber-toast-msg"></span>
    </div>`;
    document.body.appendChild(toast);
}
document.getElementById('cyber-toast-msg').textContent = `"${name.slice(0,30)}…" added to cart`;
toast.classList.add('show');
clearTimeout(toast._t);
toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ---------- Inject badge into existing cart icon link ---------- */

document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('a[href="cart.html"], a[href="./cart.html"]').forEach(a => {
    if (!a.querySelector('.cart-badge')) {
    a.style.position = 'relative';
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    a.appendChild(badge);
    }
});
updateCartBadge();

/* Animate elements on scroll */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
    if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
    }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .cards, .categories-container > div').forEach(el => {
    observer.observe(el);
});

/* Checkout feedback */

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (getCart().length === 0) return;
        checkoutBtn.textContent = '✓ Order Placed!';
        checkoutBtn.style.background = '#2a9d3a';
        setTimeout(() => {
            localStorage.removeItem('cyber_cart');
            renderCart();
            checkoutBtn.textContent = 'Checkout';
            checkoutBtn.style.background = '';
        }, 2000);
    });
}

renderCart();
});

// ===================== RENDER CART ======================

function renderCart() {
    const cart = getCart();
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-cart-shopping"></i>
                <h4>Your cart is empty</h4>
                <p>Looks like you haven't added anything yet.</p>
                <a href="products.html">Browse Products</a>
            </div>`;
        updateSummary(0);
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('checkout-btn').style.opacity = '0.5';
        return;
    }

    document.getElementById('checkout-btn').disabled = false;
    document.getElementById('checkout-btn').style.opacity = '1';

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item row align-items-center p-3 border-bottom me-2 mb-1';
        div.dataset.id = item.id;
        div.innerHTML = `
            <div class="col-2">
                <img src="${item.img}" alt="" style="width:60px;height:60px;object-fit:contain;">
            </div>
            <div class="col-4">
                <h6 class="fw-bold text-white mb-1" style="font-size:13px;">${item.name}</h6>
                <p style="font-size:12px;margin:0;">#${item.id}</p>
            </div>
            <div class="col d-flex align-items-center gap-2 flex-wrap">
                <div class="d-flex align-items-center" style="background:#5f5174;border-radius:6px;padding:2px 6px;">
                    <button class="decrement-btn border-0 bg-transparent text-white px-1" style="font-size:16px;line-height:1;">
                        <i class="fa-solid fa-minus" style="font-size:11px;"></i>
                    </button>
                    <span class="qty-display text-white mx-2" style="min-width:20px;text-align:center;font-weight:600;">${item.qty}</span>
                    <button class="increment-btn border-0 bg-transparent text-white px-1" style="font-size:16px;line-height:1;">
                        <i class="fa-solid fa-plus" style="font-size:11px;"></i>
                    </button>
                </div>
                <h6 class="text-white mb-0 fw-bold">$${(item.price * item.qty).toFixed(2)}</h6>
                <button class="delete-btn border-0 bg-transparent ms-auto" title="Remove">
                    <i class="fa-solid fa-xmark text-danger"></i>
                </button>
            </div>`;

        /* Quantity +/- */
        
        div.querySelector('.increment-btn').addEventListener('click', () => {
            updateQty(item.id, item.qty + 1);
            renderCart();
        });
        div.querySelector('.decrement-btn').addEventListener('click', () => {
            if (item.qty > 1) { updateQty(item.id, item.qty - 1); renderCart(); }
        });

        /* Delete */

        div.querySelector('.delete-btn').addEventListener('click', () => {
            div.classList.add('removing');
            setTimeout(() => { removeFromCart(item.id); renderCart(); }, 320);
        });

        list.appendChild(div);
    });

    updateSummary(cartTotal());
}

function updateSummary(subtotal) {
    const tax = subtotal * 0.02;
    const shipping = subtotal > 0 ? 29 : 0;
    document.getElementById('summary-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('summary-tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('summary-total').textContent = '$' + (subtotal + tax + shipping).toFixed(2);
}


