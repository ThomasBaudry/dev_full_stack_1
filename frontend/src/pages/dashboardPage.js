/**
 * dashboardPage.js
 * Render la page dashboard complète dans le container passé en argument.
 * Usage : import { renderDashboard } from './pages/dashboardPage.js'
 *         renderDashboard(document.getElementById('app'))
 */

import { getAddProductModalTemplate } from './modals/addProductModal.js';
import { getEditProductModalTemplate } from './modals/editProductModal.js';
import { getDeleteProductModalTemplate } from './modals/deleteProductModal.js';
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductApi,
} from '../api/productsApi.js';

// ── Template HTML principal ─────────────────────────────────────────────────
const getTemplate = () => `
  <div class="dashboard-page min-h-screen text-white relative">

    <!-- CONTENU PRINCIPAL -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-10">

      <!-- En-tête -->
      <div class="flex items-end justify-between mb-8 opacity-0 [animation:fadeUp_0.4s_ease-out_forwards]">
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
      <div class="flex items-center justify-between mb-5 opacity-0 [animation:fadeUp_0.4s_ease-out_forwards]" style="animation-delay:0.05s">
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
      <div class="rounded-2xl border border-[#1a1a26] overflow-hidden opacity-0 [animation:fadeUp_0.4s_ease-out_forwards]"
        style="animation-delay:0.1s">
        <div class="grid grid-cols-[2fr_1fr_1fr_120px] bg-[#111118] border-b border-[#1a1a26] px-6 py-3">
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Produit</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Catégorie</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Prix</span>
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

    ${getDeleteProductModalTemplate()}
    ${getAddProductModalTemplate()}
    ${getEditProductModalTemplate()}

    <!-- TOAST CONTAINER -->
    <div id="toast-container" class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none"></div>
  </div>
`;

// ── Données & état ──────────────────────────────────────────────────────────
const BACKEND_BASE_URL = 'http://localhost:5000';
let products = [];
let editingId  = null;
let deletingId = null;
let removedImageIds = [];
const normalizeProduct = (product) => ({
  id: Number(product.id),
  label: product.label ?? '',
  description: product.description ?? '',
  category: product.category ?? '',
  price: Number(product.price ?? 0),
  image_paths: Array.isArray(product.image_paths) ? product.image_paths : [],
});

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

  list.innerHTML = data.map((p, index) => {
    const catStyle  = categoryColors[p.category] ?? defaultCatStyle;
    const emoji      = categoryEmoji[p.category] ?? '📦';

    return `
      <div class="group grid grid-cols-[2fr_1fr_1fr_120px] px-6 py-4
                  opacity-0 [animation:fadeUp_0.35s_ease-out_forwards] hover:bg-[rgba(200,240,74,0.03)] transition-colors duration-150
                  border-b border-[#1a1a2666] last:border-0 items-center"
        style="animation-delay:${Math.min(index + 1, 6) * 0.05}s"
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
          <span class="px-2.5 py-1 rounded-lg border font-display text-[10px] font-semibold tracking-[0.08em] uppercase" style="${catStyle}">${p.category}</span>
        </div>
        <div>
          <span class="font-display font-semibold text-white text-sm">
            ${p.price.toFixed(2)}<span style="color:#52525b;font-size:11px;margin-left:2px">€</span>
          </span>
        </div>
        <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
const getFormValues = (prefix) => ({
  label: document.getElementById(`${prefix}-f-label`).value.trim(),
  description: document.getElementById(`${prefix}-f-description`).value.trim(),
  price: parseFloat(document.getElementById(`${prefix}-f-price`).value),
  category: document.getElementById(`${prefix}-f-category`).value.trim(),
});

const isFormValid = ({ label, description, price, category }) =>
  !!label && !!description && !isNaN(price) && price >= 0 && !!category;

const bindImagePreview = (inputId, previewId) => {
  document.getElementById(inputId).addEventListener('change', e => {
    const files = Array.from(e.target.files).slice(0, 5);
    const container = document.getElementById(previewId);
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
};

const filesToDataUrls = async (inputId) => {
  const input = document.getElementById(inputId);
  const files = Array.from(input?.files ?? []).slice(0, 5);

  const toDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result ?? '');
      reader.onerror = () => reject(new Error('Impossible de lire une image.'));
      reader.readAsDataURL(file);
    });

  return Promise.all(files.map(toDataUrl));
};

const renderExistingImages = (images) => {
  const container = document.getElementById('edit-existing-images');
  if (!images || images.length === 0) {
    container.innerHTML = '<p class="text-zinc-600 text-xs italic">Aucune image</p>';
    return;
  }

  container.innerHTML = images.map((img) => {
    const src = String(img.path).startsWith('http') ? img.path : `${BACKEND_BASE_URL}${img.path}`;
    return `
      <div class="existing-img-wrapper" data-image-id="${img.id}"
        style="position:relative;display:inline-block;transition:all 0.2s ease-out">
        <img src="${src}" alt="${img.filename}"
          class="existing-img-thumb"
          style="width:56px;height:56px;object-fit:cover;border-radius:12px;border:1px solid #252535;transition:all 0.2s ease-out" />
        <button type="button" class="toggle-existing-img"
          data-image-id="${img.id}"
          style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;
                 background:rgba(239,68,68,0.9);color:white;border:2px solid #111118;
                 display:flex;align-items:center;justify-content:center;cursor:pointer;
                 transition:all 0.15s ease-out;line-height:1">
          <svg style="width:12px;height:12px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.toggle-existing-img').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imageId = Number(btn.dataset.imageId);
      const wrapper = btn.closest('.existing-img-wrapper');
      const thumb = wrapper.querySelector('.existing-img-thumb');
      const isMarked = removedImageIds.includes(imageId);

      if (!isMarked) {
        // Marquer pour suppression : griser + icône +
        removedImageIds.push(imageId);
        thumb.style.opacity = '0.25';
        thumb.style.filter = 'grayscale(1)';
        btn.style.background = 'rgba(200,240,74,0.9)';
        btn.style.color = '#0a0a0f';
        btn.innerHTML = `
          <svg style="width:12px;height:12px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>`;
      } else {
        // Restaurer : retirer du tableau + remettre normal
        removedImageIds = removedImageIds.filter((id) => id !== imageId);
        thumb.style.opacity = '1';
        thumb.style.filter = 'none';
        btn.style.background = 'rgba(239,68,68,0.9)';
        btn.style.color = 'white';
        btn.innerHTML = `
          <svg style="width:12px;height:12px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>`;
      }
    });
  });
};

const applySearchFilter = () => {
  const query = document.getElementById('search-input')?.value.toLowerCase().trim() ?? '';
  const filtered = query
    ? products.filter((p) =>
        p.label.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    : products;

  renderTable(filtered);
};

const loadProducts = async () => {
  try {
    const data = await fetchProducts();
    products = Array.isArray(data) ? data.map(normalizeProduct) : [];
    applySearchFilter();
  } catch (err) {
    products = [];
    renderTable(products);
    showToast(err.message || 'Impossible de charger les produits', 'error');
  }
};

const openAddModal = () => {
  editingId = null;
  ['label', 'description', 'price', 'category'].forEach(field => {
    document.getElementById(`add-f-${field}`).value = '';
  });
  document.getElementById('add-image-previews').innerHTML = '';
  document.getElementById('add-form-error').classList.add('hidden');
  showModal(document.getElementById('add-modal'));
};

const openEditModal = async (id) => {
  const p = products.find(product => product.id === id);
  if (!p) return;
  editingId = id;
  removedImageIds = [];

  document.getElementById('edit-f-label').value       = p.label;
  document.getElementById('edit-f-description').value = p.description;
  document.getElementById('edit-f-price').value       = p.price;
  document.getElementById('edit-f-category').value    = p.category;
  document.getElementById('edit-f-images').value      = '';
  document.getElementById('edit-image-previews').innerHTML = '';
  document.getElementById('edit-form-error').classList.add('hidden');

  // Charger le produit complet pour récupérer les images avec leurs IDs
  try {
    const fullProduct = await fetchProduct(id);
    renderExistingImages(fullProduct.images ?? []);
  } catch {
    renderExistingImages([]);
  }

  showModal(document.getElementById('edit-modal'));
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
  const addModal = document.getElementById('add-modal');
  const editModal = document.getElementById('edit-modal');
  const deleteModal = document.getElementById('delete-modal');

  [addModal, editModal, deleteModal].forEach((modal) =>
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    })
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(addModal);
      closeModal(editModal);
      closeModal(deleteModal);
    }
  });

  document.getElementById('add-product-btn').addEventListener('click', openAddModal);

  document.getElementById('add-modal-close').addEventListener('click', () => closeModal(addModal));
  document.getElementById('add-cancel').addEventListener('click', () => closeModal(addModal));
  document.getElementById('add-submit').addEventListener('click', async () => {
    const errEl = document.getElementById('add-form-error');
    const formData = getFormValues('add');

    if (!isFormValid(formData)) {
      errEl.textContent = 'Tous les champs obligatoires doivent etre remplis.';
      errEl.classList.remove('hidden');
      return;
    }

    try {
      errEl.classList.add('hidden');
      const images = await filesToDataUrls('add-f-images');
      await createProduct({ ...formData, images });
      closeModal(addModal);
      await loadProducts();
      showToast('Produit ajoute avec succes', 'success');
    } catch (err) {
      errEl.textContent = err.message || 'Erreur lors de la creation du produit.';
      errEl.classList.remove('hidden');
    }
  });

  document.getElementById('edit-modal-close').addEventListener('click', () => closeModal(editModal));
  document.getElementById('edit-cancel').addEventListener('click', () => closeModal(editModal));
  document.getElementById('edit-submit').addEventListener('click', async () => {
    if (editingId === null) return;

    const errEl = document.getElementById('edit-form-error');
    const formData = getFormValues('edit');

    if (!isFormValid(formData)) {
      errEl.textContent = 'Tous les champs obligatoires doivent etre remplis.';
      errEl.classList.remove('hidden');
      return;
    }

    try {
      errEl.classList.add('hidden');
      const images = await filesToDataUrls('edit-f-images');
      await updateProduct(editingId, { ...formData, images, removedImageIds });
      closeModal(editModal);
      await loadProducts();
      showToast('Produit modifie avec succes', 'success');
    } catch (err) {
      errEl.textContent = err.message || 'Erreur lors de la modification du produit.';
      errEl.classList.remove('hidden');
    }
  });

  bindImagePreview('add-f-images', 'add-image-previews');
  bindImagePreview('edit-f-images', 'edit-image-previews');

  document.getElementById('delete-cancel').addEventListener('click', () => closeModal(deleteModal));
  document.getElementById('delete-confirm').addEventListener('click', async () => {
    if (deletingId === null) return;

    try {
      await deleteProductApi(deletingId);
      closeModal(deleteModal);
      deletingId = null;
      await loadProducts();
      showToast('Produit supprime', 'success');
    } catch (err) {
      closeModal(deleteModal);
      showToast(err.message || 'Erreur lors de la suppression', 'error');
    }
  });

  document.getElementById('search-input').addEventListener('input', applySearchFilter);
};

export const renderDashboard = (container) => {
  container.innerHTML = getTemplate();
  initEvents();
  loadProducts();
};
