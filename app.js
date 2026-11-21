// AuraTech E-Commerce Store - Modern JavaScript State & Cart Architecture
const products = [
  {
    id: 101,
    name: "Aura Pro Wireless ANC Headphones",
    category: "audio",
    price: 4999,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    badge: "Bestseller"
  },
  {
    id: 102,
    name: "Aura Pulse Smartwatch AMOLED",
    category: "wearables",
    price: 3499,
    rating: 4.8,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    badge: "Trending"
  },
  {
    id: 103,
    name: "Ergonomic Mechanical Keychron Keyboard",
    category: "accessories",
    price: 6899,
    rating: 5.0,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    badge: "Editor's Choice"
  },
  {
    id: 104,
    name: "Aura SoundBar 2.1 Bass Edition",
    category: "audio",
    price: 5299,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    badge: "Popular"
  },
  {
    id: 105,
    name: "Minimalist Leather Desk Pad & Mat",
    category: "accessories",
    price: 1299,
    rating: 4.9,
    reviews: 410,
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80",
    badge: null
  },
  {
    id: 106,
    name: "Ultra-Fast 65W GaN Dual Charger",
    category: "accessories",
    price: 1899,
    rating: 4.8,
    reviews: 175,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    badge: "New"
  }
];

let cart = [];
let currentCategory = 'all';

function renderProducts(items) {
  const container = document.getElementById('productGrid');
  container.innerHTML = '';

  items.forEach(p => {
    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group";

    card.innerHTML = `
      <div class="relative overflow-hidden bg-slate-100 h-52">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        ${p.badge ? `<span class="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">${p.badge}</span>` : ''}
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-1 text-xs text-amber-500 font-semibold mb-1.5">
            ⭐ ${p.rating} <span class="text-slate-400 font-normal">(${p.reviews})</span>
          </div>
          <h3 class="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition mb-3 leading-snug">${p.name}</h3>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span class="text-xs text-slate-400">Price</span>
            <div class="font-bold text-base text-slate-900">₹${p.price.toLocaleString('en-IN')}</div>
          </div>
          <button onclick="addToCart(${p.id})" class="p-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm">
            <i data-lucide="plus" class="w-4 h-4"></i> Add
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.className = "cat-pill px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition";
  });
  event.target.className = "cat-pill px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-sm transition";

  if (cat === 'all') {
    renderProducts(products);
  } else {
    renderProducts(products.filter(p => p.category === cat));
  }
}

function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  updateCartUI();
  toggleCartDrawer(true);
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  document.getElementById('cartCountBadge').innerText = totalCount;
  document.getElementById('cartCountTitle').innerText = totalCount;
  document.getElementById('cartSubtotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;

  const listContainer = document.getElementById('cartItemsList');
  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto mb-3 opacity-30"></i>
        <p class="text-sm font-medium">Your shopping bag is empty.</p>
      </div>
    `;
  } else {
    listContainer.innerHTML = cart.map(item => `
      <div class="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="text-xs font-bold text-slate-900 leading-snug mb-1">${item.name}</h4>
          <span class="text-xs font-semibold text-indigo-600">₹${item.price.toLocaleString('en-IN')}</span>
        </div>
        <div class="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-2 py-1">
          <button onclick="updateCartQty(${item.id}, -1)" class="text-slate-500 hover:text-slate-900 font-bold text-xs">-</button>
          <span class="text-xs font-bold text-slate-800">${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)" class="text-slate-500 hover:text-slate-900 font-bold text-xs">+</button>
        </div>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  if (open) {
    drawer.classList.remove('hidden');
  } else {
    drawer.classList.add('hidden');
  }
}

function simulateCheckout() {
  if (cart.length === 0) {
    alert("Please add items to your cart before proceeding to checkout!");
    return;
  }
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  alert(`Connecting to Secure Razorpay Payment Gateway...\n\nOrder Total: ₹${subtotal.toLocaleString('en-IN')}\nPayment Simulation Successful! Receipt sent.`);
  cart = [];
  updateCartUI();
  toggleCartDrawer(false);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  updateCartUI();
  lucide.createIcons();
});
