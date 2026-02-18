/**
 * Page Panier — gestion côté client avec localStorage.
 */

import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '../store/cartStore.js';
import { escapeHtml, formatPrice } from '../utils.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu d'une ligne du panier. */
const cartRow = (item) => `
  <div class="grid grid-cols-[2fr_1fr_1fr_1fr_80px] items-center px-6 py-4
    border-b border-[#1a1a2666] last:border-0 hover:bg-[#c8f04a08] transition-colors">
    <div class="flex items-center gap-3 min-w-0">
      ${item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"
            class="w-12 h-12 rounded-xl object-cover border border-[#252535] flex-shrink-0" />`
        : `<div class="w-12 h-12 rounded-xl bg-[#1a1a26] border border-[#252535] flex-shrink-0
            flex items-center justify-center">
            <svg class="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159"/>
            </svg>
          </div>`}
      <a href="#/product/${escapeHtml(String(item.productId))}"
        class="text-sm text-white font-medium truncate hover:text-[#c8f04a] transition-colors">
        ${escapeHtml(item.name)}
      </a>
    </div>
    <span class="text-sm text-zinc-400">${escapeHtml(formatPrice(item.price))}</span>
    <div class="flex items-center gap-1">
      <button class="qty-btn w-7 h-7 rounded-lg border border-[#252535] text-zinc-500
        hover:bg-[#1a1a26] hover:text-white transition-all text-xs flex items-center justify-center"
        data-id="${escapeHtml(String(item.productId))}" data-action="decrease">-</button>
      <span class="w-8 text-center text-sm text-white font-medium">${item.quantity}</span>
      <button class="qty-btn w-7 h-7 rounded-lg border border-[#252535] text-zinc-500
        hover:bg-[#1a1a26] hover:text-white transition-all text-xs flex items-center justify-center"
        data-id="${escapeHtml(String(item.productId))}" data-action="increase">+</button>
    </div>
    <span class="text-sm text-white font-display font-semibold">${escapeHtml(formatPrice(item.price * item.quantity))}</span>
    <button class="remove-btn px-2 py-1 rounded-lg border border-red-900/40 text-red-500/70
      hover:bg-red-900/20 hover:text-red-400 transition-all text-xs"
      data-id="${escapeHtml(String(item.productId))}">Suppr.</button>
  </div>
`;

/** Rendu de la page panier. */
export const renderCartPage = (container) => {
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Votre sélection</p>
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Mon Panier</h1>
        </div>
        <div class="text-center py-20">
          <div class="w-12 h-12 rounded-2xl bg-[#1a1a26] border border-[#252535] flex items-center
            justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0
                   00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114
                   0 00-16.536-1.84M7.5 14.25L5.106 5.272"/>
            </svg>
          </div>
          <p class="text-zinc-500 text-sm mb-4">Votre panier est vide.</p>
          <a href="#/" class="px-5 py-2.5 rounded-xl bg-[#c8f04a] text-[#0a0a0f] font-display
            font-semibold text-sm hover:bg-[#b5e030] transition-all duration-200">
            Voir les produits
          </a>
        </div>
      </div>`;
    return;
  }

  const total = getCartTotal();

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-8">
        <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Votre sélection</p>
        <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">Mon Panier</h1>
        <p class="text-zinc-500 text-sm mt-1">${cart.length} article${cart.length > 1 ? 's' : ''}</p>
      </div>

      <div class="rounded-2xl border border-[#1a1a26] overflow-hidden">
        <div class="grid grid-cols-[2fr_1fr_1fr_1fr_80px] bg-[#111118] border-b border-[#1a1a26] px-6 py-3">
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Produit</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Prix</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Qté</span>
          <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Sous-total</span>
          <span></span>
        </div>
        <div id="cart-items">${cart.map(cartRow).join('')}</div>
        <div class="grid grid-cols-[2fr_1fr_1fr_1fr_80px] bg-[#111118] border-t border-[#1a1a26] px-6 py-4">
          <span class="text-sm font-display font-semibold text-zinc-400 col-span-3 text-right pr-4">Total :</span>
          <span class="font-display font-bold text-lg text-[#c8f04a]">${escapeHtml(formatPrice(total))}</span>
          <span></span>
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <a href="#/" class="px-5 py-2.5 rounded-xl border border-[#252535] text-zinc-400
          hover:text-white hover:bg-[#1a1a26] text-sm transition-all duration-200">
          Continuer mes achats
        </a>
        <button id="clear-cart-btn" class="px-5 py-2.5 rounded-xl border border-red-900/40
          text-red-500/70 hover:bg-red-900/20 hover:text-red-400 text-sm transition-all duration-200">
          Vider le panier
        </button>
      </div>
    </div>
  `;

  // Quantités
  container.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const current = cart.find((i) => String(i.productId) === productId);
      if (!current) return;
      const newQty = btn.dataset.action === 'increase'
        ? current.quantity + 1
        : current.quantity - 1;
      updateQuantity(Number(productId) || productId, newQty);
      renderNavbar();
      renderCartPage(container);
    });
  });

  // Suppression
  container.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.id) || btn.dataset.id);
      renderNavbar();
      renderCartPage(container);
    });
  });

  // Vider
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    clearCart();
    renderNavbar();
    renderCartPage(container);
  });
};
