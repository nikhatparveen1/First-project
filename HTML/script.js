// Base product data
const rawItems = [
    { name: "SoulBuds X", price: 1999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500", desc: "Premium Noise Cancelling Buds with spatial audio support." },
    { name: "Stealth Key K2", price: 2200, img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=500", desc: "Compact Mechanical Wireless Keyboard with RGB lighting." },
    { name: "Vision Tab Pro", price: 25000, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500", desc: "12-inch 120Hz Workstation tablet with OLED display." },
    { name: "Aura Watch 5", price: 2800, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500", desc: "Minimalist Fitness Tracker with heart rate monitoring." }
];

// SLIDER LOGIC
let currentSlide = 0;
const totalSlides = 5;

function startSlider() {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        const offset = currentSlide * (100 / totalSlides);
        document.getElementById('carouselInner').style.transform = `translateX(-${offset}%)`;
    }, 5000); // Change slide every 5 seconds
}

// Generate 60 products with incremental pricing per version
let products = [];
for(let i=0; i<60; i++) {
    let base = rawItems[i % rawItems.length];
    let versionNumber = Math.floor(i/4) + 1;
    let incrementalPrice = base.price + (versionNumber - 1) * 499;

    products.push({
        ...base, 
        id: i, 
        name: `${base.name} Gen-${versionNumber}`,
        price: incrementalPrice
    });
}

let cart = [];
let currentUser = null;
let isSignUp = false;
let selectedPaymentMethod = 'COD';

// RENDER PRODUCTS
function renderGrid(data = products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = data.map(p => `
        <div class="card" onclick="openDetail(${p.id})">
            <div class="img-wrap"><img src="${p.img}" alt="${p.name}"></div>
            <h3>${p.name}</h3>
            <p style="color: var(--accent); font-weight: bold;">₹${p.price.toLocaleString('en-IN')}</p>
            <button class="btn-ui" style="margin-top:10px;" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// MODAL LOGIC
function openDetail(id) {
    const p = products.find(x => x.id === id);
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalName').innerText = p.name;
    document.getElementById('modalPrice').innerText = `₹${p.price.toLocaleString('en-IN')}`;
    document.getElementById('modalDesc').innerText = p.desc;
    document.getElementById('modalAddBtn').onclick = () => { addToCart(p.id); closeModal('productModal'); };
    document.getElementById('productModal').style.display = 'flex';
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// SEARCH LOGIC
function handleSearch() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(val));
    document.getElementById('suggestionBox').style.display = val ? 'block' : 'none';
    document.getElementById('suggestionBox').innerHTML = filtered.slice(0, 5).map(p => `<div class="suggestion-item" onclick="selectSuggestion('${p.name}')">${p.name}</div>`).join('');
    renderGrid(filtered);
}
function selectSuggestion(name) {
    document.getElementById('searchInput').value = name;
    handleSearch();
}

// AUTH LOGIC
function openAuth() { document.getElementById('authModal').style.display = 'flex'; }
document.getElementById('authToggle').onclick = () => {
    isSignUp = !isSignUp;
    document.getElementById('authTitle').innerText = isSignUp ? "Sign Up" : "Login";
    document.getElementById('nameGroup').style.display = isSignUp ? "block" : "none";
};
function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value;
    if(!email.endsWith("@gmail.com")) return alert("Use a valid @gmail.com email");
    currentUser = email.split('@')[0];
    document.getElementById('userZone').innerText = `👤 Hi, ${currentUser}`;
    closeModal('authModal');
}

// CART LOGIC
function addToCart(id) {
    cart.push({...products.find(x => x.id === id), cartId: Date.now()});
    updateCart();
}
function updateCart() {
    document.getElementById('cartCount').innerText = cart.length;
    document.getElementById('cartItems').innerHTML = cart.map(i => `<div style="background:var(--glass); padding:10px; margin-bottom:5px; border-radius:8px; display:flex; justify-content:space-between;"><span>${i.name}</span><b onclick="removeFromCart(${i.cartId})" style="cursor:pointer; color:var(--danger)">×</b></div>`).join('');
    const total = cart.reduce((a, b) => a + b.price, 0);
    document.getElementById('cartTotal').innerText = `Total: ₹${total.toLocaleString('en-IN')}`;
    document.getElementById('checkTotal').innerText = `Total: ₹${total.toLocaleString('en-IN')}`;
}
function removeFromCart(cid) { cart = cart.filter(x => x.cartId !== cid); updateCart(); }
function toggleCart() { document.getElementById('cartSidebar').classList.toggle('active'); }

// CHECKOUT FLOW
function goToCheckout() {
    if(!currentUser) return openAuth();
    if(!cart.length) return alert("Cart is empty");
    document.getElementById('shop-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'block';
    toggleCart();
}
function exitCheckout() { document.getElementById('shop-view').style.display = 'block'; document.getElementById('checkout-view').style.display = 'none'; }

// PAYMENT LOGIC
function togglePaymentMethod(method) { selectedPaymentMethod = method; }

function confirmOrder() {
    const addr = document.getElementById('shipAddr').value.trim();
    if(!addr || !document.getElementById('shipPhone').value) return alert("Fill all shipping details");
    if(selectedPaymentMethod === 'ONLINE') {
        document.getElementById('paymentModal').style.display = 'flex';
    } else {
        completeOrder("Cash on Delivery");
    }
}
function processOnlinePayment() {
    const card = document.getElementById('cardNumber').value;
    if(card.length < 16) return alert("Invalid card number (16 digits required)");
    completeOrder("Online Payment");
}
function completeOrder(method) {
    alert(`Order Confirmed via ${method}! Thank you for shopping with Gadgetgoals.`);
    cart = []; updateCart(); closeModal('paymentModal'); exitCheckout();
}

window.onload = () => {
    renderGrid();
    startSlider();
};