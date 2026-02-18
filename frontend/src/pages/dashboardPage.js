/**
 * dashboardPage.js
 * Render la page dashboard complète dans le container passé en argument.
 * Usage : import { renderDashboard } from './pages/dashboardPage.js'
 *         renderDashboard(document.getElementById('app'))
 */

import './dashboardPage.css';

// ── Template HTML principal ─────────────────────────────────────────────────
const getTemplate = () => `
  <div class="min-h-screen text-white relative">

    <!-- NAVBAR -->
    <nav class="relative z-10 border-b border-[#1a1a26] bg-[#111118cc] backdrop-blur-xl sticky top-0">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 rounded-lg bg-[#c8f04a] flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-[#0a0a0f]" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1.5"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5"/>
            </svg>
          </div>
          <span class="font-display font-bold text-lg tracking-tight text-white">Dashboard</span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1a1a26] border border-[#252535]">
            <div class="w-6 h-6 rounded-full bg-[#c8f04a22] border border-[#c8f04a44]
                        flex items-center justify-center flex-shrink-0">
              <span class="font-display font-semibold text-xs text-[#c8f04a]" id="user-initial">A</span>
            </div>
            <span class="text-sm text-zinc-300 font-medium" id="user-email">admin@boutique.fr</span>
          </div>

          <button id="logout-btn"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#252535]
                   text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-[#1a1a26]
                   transition-all duration-200 text-sm">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0
                   00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0
                   002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>

    <!-- CONTENU PRINCIPAL -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-10">

      <!-- En-tête -->
      <div class="flex items-end justify-between mb-8 animate-fade-up">
        <div>
          <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Catalogue</p>
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">
            Gestion des produits
          </h1>
        </div>
        <button id="add-product-btn"
          class="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#c8f04a] hover:bg-[#b5e030]
                 text-[#0a0a0f] font-display font-semibold text-sm transition-all duration-200
                 hover:shadow-lg hover:shadow-[#c8f04a33] hover:-translate-y-px active:translate-y-0">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Ajouter un produit
        </button>
      </div>

      <!-- Compteur + recherche -->
      <div class="flex items-center justify-between mb-5 animate-fade-up" style="animation-delay:0.05s">
        <p class="text-zinc-600 text-sm">
          <span id="product-count" class="text-zinc-400 font-medium">0</span> produits
        </p>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input id="search-input" type="text" placeholder="Rechercher..."
            class="pl-9 pr-4 py-2 rounded-xl bg-[#1a1a26] border border-[#252535] text-sm
                   text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#c8f04a88]
                   focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200 w-56" />
        </div>
      </div>

      <!-- Tableau -->
      <div class="rounded-2xl border border-[#1a1a26] overflow-hidden animate-fade-up"
        style="animation-delay:0.1s">
        <div class="grid grid-cols-[2fr_1fr_1fr_100px_120px] bg-[#111118] border-b border-[#1a1a26] px-6 py-3">
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Produit</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Catégorie</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Prix</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Stock</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest text-right">Actions</span>
        </div>
        <div id="products-list"></div>
        <div id="empty-state" class="hidden py-20 text-center">
          <div class="w-12 h-12 rounded-2xl bg-[#1a1a26] border border-[#252535] flex items-center
                      justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25
                   0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504
                   1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621
                   0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
            </svg>
          </div>
          <p class="text-zinc-600 text-sm font-display">Aucun produit trouvé</p>
        </div>
      </div>
    </main>

    <!-- MODAL SUPPRESSION -->
    <div id="delete-modal" class="fixed inset-0 z-50 hidden items-center justify-center modal-backdrop">
      <div class="bg-[#111118] border border-[#252535] rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-slide-in">
        <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center
                    justify-center mx-auto mb-5">
          <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165
                 L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772
                 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114
                 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
        </div>
        <h3 class="font-display font-bold text-lg text-white text-center mb-2">Supprimer ce produit ?</h3>
        <p class="text-zinc-500 text-sm text-center mb-6">
          <span class="text-zinc-300 font-medium" id="delete-product-name">—</span>
          sera définitivement supprimé. Cette action est irréversible.
        </p>
        <div class="flex gap-3">
          <button id="delete-cancel"
            class="flex-1 py-2.5 rounded-xl border border-[#252535] text-zinc-400
                   hover:bg-[#1a1a26] hover:text-white transition-all duration-200 text-sm font-medium">
            Annuler
          </button>
          <button id="delete-confirm"
            class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500
                   text-white transition-all duration-200 text-sm font-display font-semibold">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL FORMULAIRE -->
    <div id="form-modal" class="fixed inset-0 z-50 hidden items-center justify-center modal-backdrop">
      <div class="bg-[#111118] border border-[#252535] rounded-2xl shadow-2xl w-full max-w-lg mx-4
                  animate-slide-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#1a1a26] sticky top-0 bg-[#111118] z-10">
          <h3 class="font-display font-bold text-lg text-white" id="form-modal-title">Ajouter un produit</h3>
          <button id="form-modal-close"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600
                   hover:bg-[#1a1a26] hover:text-white transition-all duration-200">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div>
            <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Libellé <span class="text-[#c8f04a]">*</span>
            </label>
            <input id="f-label" type="text" placeholder="Nom du produit"
              class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                     text-white placeholder-zinc-600 text-sm focus:outline-none
                     focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
          </div>
          <div>
            <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Description <span class="text-[#c8f04a]">*</span>
            </label>
            <textarea id="f-description" rows="3" placeholder="Décrivez le produit..."
              class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                     text-white placeholder-zinc-600 text-sm focus:outline-none
                     focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22]
                     transition-all duration-200 resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Prix (€) <span class="text-[#c8f04a]">*</span>
              </label>
              <input id="f-price" type="number" min="0" step="0.01" placeholder="0.00"
                class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                       text-white placeholder-zinc-600 text-sm focus:outline-none
                       focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
            </div>
            <div>
              <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                Catégorie <span class="text-[#c8f04a]">*</span>
              </label>
              <input id="f-category" type="text" placeholder="Ex: Alimentation"
                class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                       text-white placeholder-zinc-600 text-sm focus:outline-none
                       focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-display font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Images <span class="text-zinc-600 normal-case font-normal">(max 5)</span>
            </label>
            <div id="drop-zone"
              class="border-2 border-dashed border-[#252535] rounded-xl p-5 text-center
                     hover:border-[#c8f04a66] hover:bg-[#c8f04a08] transition-all duration-200
                     cursor-pointer relative group">
              <input id="f-images" type="file" accept="image/*" multiple
                class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <svg class="w-6 h-6 text-zinc-700 group-hover:text-[#c8f04a66] mx-auto mb-2 transition-colors duration-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0
                     0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
              <p class="text-zinc-600 text-xs">Glissez vos images ou <span class="text-[#c8f04a99]">parcourir</span></p>
            </div>
            <div id="image-previews" class="flex flex-wrap gap-2 mt-2"></div>
          </div>
          <p id="form-error" class="hidden text-red-400 text-xs py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20"></p>
          <div class="flex gap-3 pt-1">
            <button id="form-cancel"
              class="flex-1 py-2.5 rounded-xl border border-[#252535] text-zinc-400
                     hover:bg-[#1a1a26] hover:text-white transition-all duration-200 text-sm font-medium">
              Annuler
            </button>
            <button id="form-submit"
              class="flex-1 py-2.5 rounded-xl bg-[#c8f04a] hover:bg-[#b5e030] text-[#0a0a0f]
                     font-display font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[#c8f04a22]">
              <span id="form-submit-text">Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST CONTAINER -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none"></div>
  </div>
`;

// ── Données & état ──────────────────────────────────────────────────────────
let products = [
  { id: 1, label: 'Granola Bio Avoine-Miel',    description: 'Mélange croustillant artisanal', category: 'Alimentation', price: 8.90,    stock: 42 },
  { id: 2, label: 'Chaise Scandinave Hêtre',    description: 'Design minimaliste nordique',    category: 'Ameublement',  price: 189.00,  stock: 7  },
  { id: 3, label: 'Vélo de Route Carbone',       description: 'Cadre ultra-léger 7.2kg',       category: 'Sport',        price: 1249.00, stock: 3  },
  { id: 4, label: 'Thé Matcha Cérémonie',        description: 'Grade A, origine Uji Japon',    category: 'Alimentation', price: 24.50,   stock: 28 },
  { id: 5, label: 'Lampe Béton Industrielle',    description: 'Abat-jour réglable 360°',       category: 'Ameublement',  price: 67.00,   stock: 14 },
  { id: 6, label: 'Tapis de Yoga Liège',         description: 'Antidérapant, épaisseur 4mm',   category: 'Sport',        price: 55.00,   stock: 19 },
];
let nextId     = 7;
let editingId  = null;
let deletingId = null;

const categoryColors = {
  'Alimentation': 'color:#34d399;background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.2)',
  'Ameublement':  'color:#38bdf8;background:rgba(56,189,248,0.1);border-color:rgba(56,189,248,0.2)',
  'Sport':        'color:#fb923c;background:rgba(251,146,60,0.1); border-color:rgba(251,146,60,0.2)',
};
const defaultCatStyle = 'color:#a1a1aa;background:rgba(161,161,170,0.1);border-color:rgba(161,161,170,0.2)';
const categoryEmoji = { 'Alimentation': '🌿', 'Ameublement': '🪑', 'Sport': '⚡' };

// ── Rendu du tableau ────────────────────────────────────────────────────────
const renderTable = (data) => {
  const list  = document.getElementById('products-list');
  const empty = document.getElementById('empty-state');
  document.getElementById('product-count').textContent = data.length;

  if (!data.length) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  list.innerHTML = data.map(p => {
    const catStyle  = categoryColors[p.category] ?? defaultCatStyle;
    const stockColor = p.stock <= 5 ? 'color:#f87171' : p.stock <= 15 ? 'color:#fbbf24' : 'color:#a1a1aa';
    const emoji      = categoryEmoji[p.category] ?? '📦';

    return `
      <div class="product-row grid grid-cols-[2fr_1fr_1fr_100px_120px] px-6 py-4
                  border-b border-[#1a1a2666] last:border-0 items-center"
        data-id="${p.id}">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-[#1a1a26] border border-[#252535] flex-shrink-0
                      flex items-center justify-center text-lg">${emoji}</div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-white truncate">${p.label}</p>
            <p class="text-xs text-zinc-600 truncate">${p.description}</p>
          </div>
        </div>
        <div>
          <span class="cat-badge px-2.5 py-1 rounded-lg border" style="${catStyle}">${p.category}</span>
        </div>
        <div>
          <span class="font-display font-semibold text-white text-sm">
            ${p.price.toFixed(2)}<span style="color:#52525b;font-size:11px;margin-left:2px">€</span>
          </span>
        </div>
        <div>
          <span class="text-sm font-medium" style="${stockColor}">${p.stock}</span>
          <span style="color:#3f3f46;font-size:12px;margin-left:4px">unités</span>
        </div>
        <div class="flex items-center justify-end gap-2 row-actions">
          <button class="edit-btn px-3 py-1.5 rounded-lg border border-[#252535] text-zinc-500
                         hover:bg-[#1a1a26] hover:text-white hover:border-zinc-600
                         transition-all duration-200 text-xs font-medium" data-id="${p.id}">
            Modifier
          </button>
          <button class="delete-btn px-3 py-1.5 rounded-lg border border-red-900/40 text-red-500/70
                         hover:bg-red-900/20 hover:text-red-400 hover:border-red-800
                         transition-all duration-200 text-xs font-medium" data-id="${p.id}">
            Suppr.
          </button>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)))
  );
  list.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)))
  );
};

// ── Helpers modal ───────────────────────────────────────────────────────────
const showModal  = (el) => { el.classList.remove('hidden'); el.classList.add('flex'); document.body.style.overflow = 'hidden'; };
const closeModal = (el) => { el.classList.add('hidden'); el.classList.remove('flex'); document.body.style.overflow = ''; };

// ── Modal formulaire ────────────────────────────────────────────────────────
const openAddModal = () => {
  editingId = null;
  document.getElementById('form-modal-title').textContent  = 'Ajouter un produit';
  document.getElementById('form-submit-text').textContent  = 'Ajouter';
  ['f-label', 'f-description', 'f-price', 'f-category'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('image-previews').innerHTML = '';
  document.getElementById('form-error').classList.add('hidden');
  showModal(document.getElementById('form-modal'));
};

const openEditModal = (id) => {
  const p = products.find(p => p.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('form-modal-title').textContent = 'Modifier le produit';
  document.getElementById('form-submit-text').textContent = 'Enregistrer';
  document.getElementById('f-label').value       = p.label;
  document.getElementById('f-description').value = p.description;
  document.getElementById('f-price').value       = p.price;
  document.getElementById('f-category').value    = p.category;
  document.getElementById('form-error').classList.add('hidden');
  showModal(document.getElementById('form-modal'));
};

// ── Modal suppression ───────────────────────────────────────────────────────
const openDeleteModal = (id) => {
  const p = products.find(p => p.id === id);
  if (!p) return;
  deletingId = id;
  document.getElementById('delete-product-name').textContent = p.label;
  showModal(document.getElementById('delete-modal'));
};

// ── Toast ───────────────────────────────────────────────────────────────────
const showToast = (message, type = 'info') => {
  const container = document.getElementById('toast-container');
  const borderColor = { success: '#c8f04a44', error: '#ef444444', info: '#38bdf844' }[type] ?? '#38bdf844';
  const textColor   = { success: '#c8f04a',   error: '#f87171',   info: '#38bdf8'   }[type] ?? '#38bdf8';
  const iconPath    = {
    success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    error:   'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    info:    'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  }[type] ?? '';

  const toast = document.createElement('div');
  toast.style.cssText = `pointer-events:auto;display:flex;align-items:center;gap:12px;padding:12px 16px;
    border-radius:12px;background:#111118;border:1px solid ${borderColor};box-shadow:0 10px 30px #00000066;
    max-width:280px;transform:translateX(32px);opacity:0;transition:all 0.3s ease-out;`;
  toast.innerHTML = `
    <svg style="width:16px;height:16px;flex-shrink:0;color:${textColor}" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="${iconPath}"/>
    </svg>
    <p style="font-size:14px;color:#d4d4d8;font-weight:500;margin:0">${message}</p>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity   = '1';
  }));
  setTimeout(() => {
    toast.style.transform = 'translateX(32px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ── Initialisation des événements ───────────────────────────────────────────
const initEvents = () => {
  const formModal   = document.getElementById('form-modal');
  const deleteModal = document.getElementById('delete-modal');

  // Fermer sur clic backdrop + Escape
  [formModal, deleteModal].forEach(modal =>
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); })
  );
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(formModal); closeModal(deleteModal); }
  });

  // Navbar
  document.getElementById('add-product-btn').addEventListener('click', openAddModal);
  document.getElementById('logout-btn').addEventListener('click', () => {
    showToast('Déconnexion en cours...', 'info');
    // TODO: appel API logout + redirect
    // setTimeout(() => window.location.hash = '#/login', 1200);
  });

  // Formulaire
  document.getElementById('form-modal-close').addEventListener('click', () => closeModal(formModal));
  document.getElementById('form-cancel').addEventListener('click',      () => closeModal(formModal));

  document.getElementById('form-submit').addEventListener('click', () => {
    const label    = document.getElementById('f-label').value.trim();
    const desc     = document.getElementById('f-description').value.trim();
    const price    = parseFloat(document.getElementById('f-price').value);
    const category = document.getElementById('f-category').value.trim();
    const errEl    = document.getElementById('form-error');

    if (!label || !desc || isNaN(price) || price < 0 || !category) {
      errEl.textContent = 'Tous les champs obligatoires doivent être remplis.';
      errEl.classList.remove('hidden');
      return;
    }

    if (editingId !== null) {
      products = products.map(p => p.id === editingId ? { ...p, label, description: desc, price, category } : p);
      showToast('Produit modifié avec succès', 'success');
    } else {
      products.push({ id: nextId++, label, description: desc, price, category, stock: 0 });
      showToast('Produit ajouté avec succès', 'success');
    }

    closeModal(formModal);
    renderTable(products);
  });

  // Upload images — preview
  document.getElementById('f-images').addEventListener('change', e => {
    const files = Array.from(e.target.files).slice(0, 5);
    const container = document.getElementById('image-previews');
    container.innerHTML = '';
    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const div = document.createElement('div');
        div.style.cssText = 'position:relative;display:inline-block';
        div.innerHTML = `
          <img src="${ev.target.result}" alt="Preview ${i+1}"
            style="width:56px;height:56px;object-fit:cover;border-radius:12px;border:1px solid #252535" />
        `;
        container.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  });

  // Suppression
  document.getElementById('delete-cancel').addEventListener('click',  () => closeModal(deleteModal));
  document.getElementById('delete-confirm').addEventListener('click', () => {
    products = products.filter(p => p.id !== deletingId);
    closeModal(deleteModal);
    renderTable(products);
    showToast('Produit supprimé', 'success');
    deletingId = null;
  });

  // Recherche
  document.getElementById('search-input').addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    renderTable(q
      ? products.filter(p =>
          p.label.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      : products
    );
  });
};

// ── Export principal ────────────────────────────────────────────────────────
export const renderDashboard = (container) => {
  container.innerHTML = getTemplate();
  initEvents();
  renderTable(products);
};