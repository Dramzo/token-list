const categories = ['céréales', 'fruits', 'légumes', 'légumineuses', 'alimentation animale', 'produits transformés', 'autres'];
const cities = ['Selibaby', 'Nouakchott', 'Kaédi', 'Boutlimit', 'Rosso', 'Atar', 'Chinguetti'];

const demoProducts = [
  { id: 1, title: 'Tomate fraîche', category: 'légumes', city: 'Rosso', price: 18, unit: 'kg', qty: 520, status: 'disponible', seller: 'Ferme El Baraka' },
  { id: 2, title: 'Riz local blanc', category: 'céréales', city: 'Kaédi', price: 260, unit: 'sac', qty: 40, status: 'disponible', seller: 'Coopérative Walo' },
  { id: 3, title: 'Oignon jaune', category: 'légumes', city: 'Atar', price: 22, unit: 'kg', qty: 300, status: 'réservé', seller: 'Mahmoud Agri' },
  { id: 4, title: 'Dattes séchées', category: 'produits transformés', city: 'Chinguetti', price: 95, unit: 'kg', qty: 140, status: 'disponible', seller: 'Oasis Chinguetti' }
];

const state = {
  user: null,
  currentRole: 'buyer',
  products: [...demoProducts],
  favorites: [1],
  offers: [
    { id: 'OF-2026-001', productId: 2, buyer: 'Aicha S.', amount: 240, quantity: 10, status: 'en attente', note: 'Livraison Boutlimit possible ?' },
    { id: 'OF-2026-002', productId: 3, buyer: 'Ibrahim B.', amount: 20, quantity: 100, status: 'contre-offre envoyée', note: 'Je peux prendre en lot.' }
  ],
  messages: [
    { id: 1, with: 'Ferme El Baraka', context: 'Tomate fraîche', last: 'Disponible demain matin', unread: true },
    { id: 2, with: 'Coopérative Walo', context: 'Offre OF-2026-001', last: 'Je vérifie le stock', unread: false }
  ],
  selectedProductForOffer: null
};

const $ = (id) => document.getElementById(id);

function seedFilters() {
  categories.forEach((c) => $('categoryFilter').insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
  cities.forEach((c) => $('cityFilter').insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
}

function renderDashboard() {
  const card = $('dashboard');
  if (!state.user) return;

  const seller = state.user.role === 'seller';
  const activeProducts = state.products.filter((p) => p.status === 'disponible').length;

  card.innerHTML = `
    <h2>Tableau de bord ${seller ? 'vendeur' : 'acheteur'}</h2>
    <div class="quick-actions">
      <div class="item"><strong>${activeProducts}</strong><br/>Annonces actives</div>
      <div class="item"><strong>${state.offers.length}</strong><br/>${seller ? 'Offres reçues' : 'Offres envoyées'}</div>
      <div class="item"><strong>${state.messages.length}</strong><br/>Discussions</div>
      <div class="item"><strong>${state.favorites.length}</strong><br/>Favoris</div>
    </div>
    <p>Connecté: <strong>${state.user.name}</strong> (${seller ? 'vendeur' : 'acheteur'}) - ${state.user.city}</p>
  `;
}

function visibleProducts() {
  const q = $('q').value.toLowerCase();
  const category = $('categoryFilter').value;
  const city = $('cityFilter').value;
  const sort = $('sort').value;

  let items = state.products.filter((p) =>
    p.title.toLowerCase().includes(q) &&
    (!category || p.category === category) &&
    (!city || p.city === city)
  );

  if (sort === 'priceAsc') items.sort((a, b) => a.price - b.price);
  if (sort === 'priceDesc') items.sort((a, b) => b.price - a.price);

  return items;
}

function renderProducts() {
  const list = $('products');
  const canOffer = state.user?.role === 'buyer';
  list.innerHTML = visibleProducts().map((p) => `
      <article class="item">
        <div class="row"><strong>${p.title}</strong><span class="pill">${p.status}</span></div>
        <p>${p.category} • ${p.city} • ${p.qty} ${p.unit}</p>
        <p><strong>${p.price} MRU/${p.unit}</strong> — vendeur: ${p.seller}</p>
        <div class="row">
          ${canOffer ? `<button onclick="openOffer(${p.id})">Faire une offre</button>` : `<button class="secondary" onclick="markSold(${p.id})">Marquer vendu</button>`}
          <button class="secondary" onclick="toggleFavorite(${p.id})">${state.favorites.includes(p.id) ? 'Retirer favori' : 'Ajouter favori'}</button>
        </div>
      </article>
    `).join('') || '<p>Aucun produit trouvé.</p>';
}

function renderOffers() {
  const list = $('offers');
  const seller = state.user?.role === 'seller';
  list.innerHTML = state.offers.map((o) => {
    const product = state.products.find((p) => p.id === o.productId);
    return `
    <article class="item">
      <div class="row"><strong>${o.id}</strong><span class="pill">${o.status}</span></div>
      <p>${product?.title || 'Produit'} - ${o.quantity} ${product?.unit || 'u'} à ${o.amount} MRU</p>
      <p>Message: ${o.note || 'Aucun message'}</p>
      ${seller ? `<div class="row"><button onclick="setOfferStatus('${o.id}','acceptée')">Accepter</button><button class="secondary" onclick="setOfferStatus('${o.id}','refusée')">Refuser</button></div>` : ''}
    </article>`;
  }).join('');
}

function renderMessages() {
  $('threads').innerHTML = state.messages.map((m) => `
    <article class="item">
      <div class="row"><strong>${m.with}</strong>${m.unread ? '<span class="pill">non lu</span>' : ''}</div>
      <p>${m.context}</p><p>${m.last}</p>
    </article>
  `).join('');
}

function renderFavorites() {
  const favs = state.products.filter((p) => state.favorites.includes(p.id));
  $('favorites').innerHTML = favs.map((f) => `<article class="item"><strong>${f.title}</strong><p>${f.city} • ${f.price} MRU/${f.unit}</p></article>`).join('') || '<p>Aucun favori.</p>';
}

window.toggleFavorite = (id) => {
  state.favorites = state.favorites.includes(id) ? state.favorites.filter((x) => x !== id) : [...state.favorites, id];
  renderProducts();
  renderFavorites();
  renderDashboard();
};

window.openOffer = (productId) => {
  state.selectedProductForOffer = productId;
  const product = state.products.find((p) => p.id === productId);
  $('offerProduct').textContent = `${product.title} - Prix demandé ${product.price} MRU/${product.unit}`;
  $('offerDialog').showModal();
};

window.markSold = (productId) => {
  state.products = state.products.map((p) => (p.id === productId ? { ...p, status: 'vendu' } : p));
  renderProducts();
  renderDashboard();
};

window.setOfferStatus = (offerId, status) => {
  state.offers = state.offers.map((o) => (o.id === offerId ? { ...o, status } : o));
  renderOffers();
};

$('offerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const product = state.products.find((p) => p.id === state.selectedProductForOffer);
  state.offers.unshift({
    id: `OF-2026-${String(state.offers.length + 1).padStart(3, '0')}`,
    productId: state.selectedProductForOffer,
    buyer: state.user.name,
    amount: Number($('offerAmount').value),
    quantity: Number($('offerQty').value),
    note: $('offerMsg').value,
    status: 'en attente'
  });
  state.messages.unshift({ id: Date.now(), with: product.seller, context: product.title, last: 'Nouvelle offre envoyée', unread: false });
  $('offerDialog').close();
  $('offerForm').reset();
  renderOffers();
  renderMessages();
  renderDashboard();
});

$('login').addEventListener('click', () => {
  state.user = {
    name: $('name').value || 'Utilisateur démo',
    phone: $('phone').value || '+222 00 00 00 00',
    city: $('city').value,
    role: $('role').value
  };

  ['dashboard', 'catalog', 'offersSection', 'messagesSection', 'favoritesSection'].forEach((id) => $(id).classList.remove('hidden'));
  renderDashboard();
  renderProducts();
  renderOffers();
  renderMessages();
  renderFavorites();
});

$('switchRole').addEventListener('click', () => {
  const role = $('role').value === 'buyer' ? 'seller' : 'buyer';
  $('role').value = role;
  $('switchRole').textContent = role === 'buyer' ? 'Mode Acheteur' : 'Mode Vendeur';
});

['q', 'categoryFilter', 'cityFilter', 'sort'].forEach((id) => $(id).addEventListener('input', renderProducts));

seedFilters();
