/**
 * Page d'accueil — affichage de tous les produits en grille.
 */

import { fetchProducts } from '../api/productsApi.js';
import { productCard } from '../components/productCard.js';
import { addToCart } from '../store/cartStore.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSearchBar } from '../components/searchBar.js';
import { escapeHtml } from '../utils.js';

/** Rendu de la page produits. */
export const renderProductsPage = async (container) => {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-8">
        <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Catalogue</p>
        <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">
          Tous nos produits
        </h1>
      </div>
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  `;

  try {
    const products = await fetchProducts();
    const list = Array.isArray(products) ? products : [];

    if (list.length === 0) {
      container.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 py-10">
          <div class="mb-8">
            <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Catalogue</p>
            <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Tous nos produits</h1>
          </div>
          <div class="text-center py-20">
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
            <p class="text-zinc-500 text-sm">Aucun produit disponible pour le moment.</p>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Catalogue</p>
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Tous nos produits</h1>
          <p class="text-zinc-500 text-sm mt-1"><span class="text-zinc-400 font-medium">${list.length}</span> produit${list.length > 1 ? 's' : ''}</p>
        </div>
        <div id="search-bar-slot"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" id="product-grid">
          ${list.map(productCard).join('')}
        </div>
      </div>
    `;

    // Barre de recherche dans la page produits
    renderSearchBar(container.querySelector('#search-bar-slot'));

    // Ajouter au panier
    container.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.productId;
        const product = list.find((p) => String(p.id) === id);
        if (product) {
          addToCart(product);
          renderNavbar();
          btn.textContent = 'Ajouté !';
          btn.classList.add('bg-[#c8f04a]', 'text-[#0a0a0f]', 'border-[#c8f04a]');
          setTimeout(() => {
            btn.textContent = 'Ajouter au panier';
            btn.classList.remove('bg-[#c8f04a]', 'text-[#0a0a0f]', 'border-[#c8f04a]');
          }, 1500);
        }
      });
    });
  } catch (err) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Tous nos produits</h1>
        </div>
        <div class="rounded-2xl border border-red-900/40 bg-red-900/10 p-6 text-center">
          <p class="text-red-400 text-sm">Impossible de charger les produits. Vérifiez que le backend est démarré.</p>
          <p class="text-red-500/60 text-xs mt-1">${escapeHtml(err.message)}</p>
        </div>
      </div>`;
  }
};
