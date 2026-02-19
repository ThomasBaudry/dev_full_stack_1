/**
 * Page détail d'un produit — images, description, prix, ajout panier.
 */

import { fetchProduct } from '../api/productsApi.js';
import { escapeHtml, formatPrice } from '../utils.js';
import { addToCart } from '../store/cartStore.js';
import { renderNavbar } from '../components/navbar.js';

const BACKEND_BASE_URL = 'http://localhost:5000';

/** Rendu de la page détail produit. */
export const renderProductDetailPage = async (container, { id }) => {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10 flex justify-center">
      <div class="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin"></div>
    </div>`;

  try {
    const product = await fetchProduct(id);
    const name = product.libelle || product.label || product.name || '';
    const images = Array.isArray(product.images)
      ? product.images
          .map((img) => (typeof img === 'string' ? img : img?.path))
          .filter(Boolean)
          .map((path) => (String(path).startsWith('http') ? String(path) : `${BACKEND_BASE_URL}${path}`))
      : [];
    const category = product.categorie || product.category || '';
    const price = product.prix || product.price || 0;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <a href="#/" class="hover:text-[#c8f04a] transition-colors">Produits</a>
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
          <span class="text-zinc-400">${escapeHtml(name)}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Images -->
          <div>
            ${images.length > 0 ? `
              <div class="rounded-2xl overflow-hidden bg-[#0a0a0f] border border-[#1a1a26] mb-3">
                <img id="main-image" src="${escapeHtml(images[0])}" alt="${escapeHtml(name)}"
                  class="w-full h-96 object-contain" />
              </div>
              ${images.length > 1 ? `
                <div class="flex gap-2 overflow-x-auto pb-2" id="image-thumbs">
                  ${images.map((img, i) => `
                    <button class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2
                      ${i === 0 ? 'border-[#c8f04a]' : 'border-[#252535]'} hover:border-[#c8f04a]
                      transition-all duration-200 thumb-btn" data-index="${i}">
                      <img src="${escapeHtml(img)}" alt="Image ${i + 1}"
                        class="w-full h-full object-cover" />
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            ` : `
              <div class="rounded-2xl bg-[#0a0a0f] border border-[#1a1a26] h-96 flex items-center justify-center">
                <svg class="w-16 h-16 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25
                       2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25
                       0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"/>
                </svg>
              </div>
            `}
          </div>

          <!-- Infos -->
          <div class="flex flex-col gap-6">
            <div>
              ${category ? `<span class="inline-block px-3 py-1 rounded-lg border border-[#252535]
                text-xs font-display font-semibold uppercase tracking-widest text-zinc-400 mb-3">${escapeHtml(category)}</span>` : ''}
              <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">${escapeHtml(name)}</h1>
            </div>

            <p class="font-display font-bold text-2xl text-[#c8f04a]">${escapeHtml(formatPrice(price))}</p>

            <div class="text-zinc-400 text-sm leading-relaxed">
              ${escapeHtml(product.description || 'Aucune description disponible.')}
            </div>

            <div class="flex gap-3 mt-4">
              <button id="add-to-cart-detail"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c8f04a]
                  hover:bg-[#b5e030] text-[#0a0a0f] font-display font-semibold text-sm
                  transition-all duration-200 hover:shadow-lg hover:shadow-[#c8f04a33]">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0
                       00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114
                       0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0
                       .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                </svg>
                Ajouter au panier
              </button>
              <a href="#/" class="flex items-center justify-center px-5 py-3 rounded-xl border border-[#252535]
                text-zinc-400 hover:text-white hover:bg-[#1a1a26] transition-all duration-200 text-sm">
                Retour
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Changement d'image principale via les miniatures
    const thumbs = container.querySelectorAll('.thumb-btn');
    const mainImg = document.getElementById('main-image');
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.index);
        if (mainImg && images[idx]) mainImg.src = images[idx];
        thumbs.forEach((t) => t.classList.replace('border-[#c8f04a]', 'border-[#252535]'));
        thumb.classList.replace('border-[#252535]', 'border-[#c8f04a]');
      });
    });

    // Ajout au panier
    document.getElementById('add-to-cart-detail').addEventListener('click', (e) => {
      addToCart(product);
      renderNavbar();
      e.target.textContent = 'Ajouté !';
      setTimeout(() => { e.target.textContent = 'Ajouter au panier'; }, 1500);
    });
  } catch (err) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="rounded-2xl border border-red-900/40 bg-red-900/10 p-6 text-center">
          <p class="text-red-400 text-sm">Impossible de charger le produit.</p>
          <p class="text-red-500/60 text-xs mt-1">${escapeHtml(err.message)}</p>
        </div>
        <a href="#/" class="inline-block mt-4 px-5 py-2.5 rounded-xl border border-[#252535]
          text-zinc-400 hover:text-white text-sm">Retour</a>
      </div>`;
  }
};
