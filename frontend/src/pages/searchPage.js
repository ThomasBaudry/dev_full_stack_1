/**
 * Page de recherche - filtre local sur la liste de produits.
 */

import { fetchProducts } from '../api/productsApi.js';
import { productCard } from '../components/productCard.js';
import { addToCart } from '../store/cartStore.js';
import { renderNavbar } from '../components/navbar.js';
import { escapeHtml } from '../utils.js';

const toSearchString = (value) => String(value ?? '').toLowerCase();

export const renderSearchPage = async (container, _params, query) => {
  const q = String(query.q ?? '').trim();
  const qNorm = q.toLowerCase();

  if (!qNorm) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <h2 class="font-display font-extrabold text-3xl text-white">Recherche</h2>
        <p class="text-zinc-500 text-sm mt-2">Veuillez saisir un terme de recherche.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <h2 class="font-display font-extrabold text-3xl text-white mb-6">
        Resultats pour « ${escapeHtml(q)} »
      </h2>
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>`;

  try {
    const allProducts = await fetchProducts();
    const products = (Array.isArray(allProducts) ? allProducts : []).filter((p) => {
      const label = toSearchString(p.label || p.libelle || p.name);
      const description = toSearchString(p.description);
      const category = toSearchString(p.category || p.categorie);
      return label.includes(qNorm) || description.includes(qNorm) || category.includes(qNorm);
    });

    if (products.length === 0) {
      container.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 py-10">
          <h2 class="font-display font-extrabold text-3xl text-white mb-4">
            Resultats pour « ${escapeHtml(q)} »
          </h2>
          <p class="text-zinc-500 text-sm">Aucun produit trouve.</p>
          <a href="#/" class="inline-block mt-4 px-5 py-2.5 rounded-xl border border-[#252535]
            text-zinc-400 hover:text-white text-sm">Retour</a>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <h2 class="font-display font-extrabold text-3xl text-white mb-1">
          Resultats pour « ${escapeHtml(q)} »
        </h2>
        <p class="text-zinc-500 text-sm mb-6">${products.length} resultat${products.length > 1 ? 's' : ''}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          ${products.map(productCard).join('')}
        </div>
      </div>`;

    container.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.productId;
        const product = products.find((p) => String(p.id) === id);
        if (!product) return;

        addToCart(product);
        renderNavbar();
        btn.textContent = 'Ajoute !';
        setTimeout(() => {
          btn.textContent = 'Ajouter au panier';
        }, 1500);
      });
    });
  } catch (err) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <h2 class="font-display font-extrabold text-3xl text-white mb-4">Recherche</h2>
        <div class="rounded-2xl border border-red-900/40 bg-red-900/10 p-6 text-center">
          <p class="text-red-400 text-sm">Erreur lors de la recherche.</p>
          <p class="text-red-500/60 text-xs mt-1">${escapeHtml(err.message)}</p>
        </div>
      </div>`;
  }
};
