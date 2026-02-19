/**
 * Composant carte produit réutilisable — style Tailwind dark.
 */

import { escapeHtml, formatPrice, truncate } from '../utils.js';

const BACKEND_BASE_URL = 'http://localhost:5000';

/** Couleurs par catégorie (cohérent avec le dashboard). */
const categoryColors = {
  'Alimentation': 'color:#34d399;background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.2)',
  'Ameublement':  'color:#38bdf8;background:rgba(56,189,248,0.1);border-color:rgba(56,189,248,0.2)',
  'Sport':        'color:#fb923c;background:rgba(251,146,60,0.1);border-color:rgba(251,146,60,0.2)',
};
const defaultCatStyle = 'color:#a1a1aa;background:rgba(161,161,170,0.1);border-color:rgba(161,161,170,0.2)';

/** Génère le HTML d'une carte produit. */
export const productCard = (product) => {
  const name = escapeHtml(product.libelle || product.label || product.name || '');
  const desc = escapeHtml(truncate(product.description || '', 80));
  const price = product.prix || product.price || 0;
  const category = escapeHtml(product.categorie || product.category || '');
  const catStyle = categoryColors[product.categorie || product.category] || defaultCatStyle;
  const firstImagePath =
    (Array.isArray(product.image_paths) && product.image_paths.length > 0
      ? product.image_paths[0]
      : Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : '') || '';

  const imageUrl = String(firstImagePath).startsWith('http')
    ? String(firstImagePath)
    : firstImagePath
      ? `${BACKEND_BASE_URL}${firstImagePath}`
      : '';
  const image = imageUrl ? escapeHtml(imageUrl) : '';
  const id = escapeHtml(String(product.id));

  return `
    <div class="group bg-[#111118] border border-[#1a1a26] rounded-2xl overflow-hidden
      hover:border-[#252535] hover:shadow-lg hover:shadow-black/20 transition-all duration-300
      hover:-translate-y-1">
      <a href="#/product/${id}" class="block">
        ${image
          ? `<div class="h-48 overflow-hidden bg-[#0a0a0f]">
               <img src="${image}" alt="${name}" class="w-full h-full object-cover
                 group-hover:scale-105 transition-transform duration-300" />
             </div>`
          : `<div class="h-48 bg-[#0a0a0f] flex items-center justify-center">
               <svg class="w-12 h-12 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                 <path stroke-linecap="round" stroke-linejoin="round"
                   d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25
                      2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25
                      0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"/>
               </svg>
             </div>`}
      </a>
      <div class="p-4 flex flex-col gap-3">
        <div>
          <a href="#/product/${id}" class="font-display font-semibold text-white text-sm
            hover:text-[#c8f04a] transition-colors duration-200">${name}</a>
          <p class="text-xs text-zinc-600 mt-1 leading-relaxed">${desc}</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-display font-bold text-white">
            ${escapeHtml(formatPrice(price))}
          </span>
          ${category ? `<span class="px-2 py-0.5 rounded-lg border text-[10px] font-display
            font-semibold uppercase tracking-widest" style="${catStyle}">${category}</span>` : ''}
        </div>
        <button class="add-to-cart-btn w-full py-2 rounded-xl border border-[#252535] text-zinc-400
          hover:bg-[#c8f04a] hover:text-[#0a0a0f] hover:border-[#c8f04a]
          font-display font-semibold text-xs transition-all duration-200"
          data-product-id="${id}">
          Ajouter au panier
        </button>
      </div>
    </div>
  `;
};
