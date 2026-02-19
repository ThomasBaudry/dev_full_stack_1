/**
 * Composant Navbar — design Tailwind cohérent avec le dashboard.
 */

import { escapeHtml } from '../utils.js';
import { isAuthenticated, clearAuth, getCurrentUser } from '../store/authStore.js';
import { getCartCount } from '../store/cartStore.js';
import { navigateTo } from '../router/router.js';
import { logout } from '../api/authApi.js';
import { clearCsrfToken } from '../api/http.js';

/** Génère et injecte la navbar dans #navbar. */
export const renderNavbar = () => {
  const authenticated = isAuthenticated();
  const cartCount = getCartCount();
  const user = getCurrentUser();

  const authLinks = authenticated
    ? `
      <a href="#/dashboard" class="px-3 py-1.5 rounded-lg text-sm text-zinc-400
        hover:text-white hover:bg-[#1a1a26] transition-all duration-200">Dashboard</a>
      <a href="#/csp-reports" class="px-3 py-1.5 rounded-lg text-sm text-zinc-400
        hover:text-white hover:bg-[#1a1a26] transition-all duration-200">CSP</a>
      <button id="logout-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#252535]
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
    `
    : `
      <a href="#/login" class="px-3 py-1.5 rounded-lg text-sm text-zinc-400
        hover:text-white hover:bg-[#1a1a26] transition-all duration-200">Connexion</a>
      <a href="#/register" class="px-3.5 py-1.5 rounded-lg bg-[#c8f04a] text-[#0a0a0f]
        font-display font-semibold text-sm hover:bg-[#b5e030] transition-all duration-200">Inscription</a>
    `;

  const navbarEl = document.getElementById('navbar');
  if (!navbarEl) return;

  navbarEl.innerHTML = `
    <nav class="border-b border-[#1a1a26] bg-[#111118cc] backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <a href="#/" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#c8f04a] flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-[#0a0a0f]" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1.5"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5"/>
              </svg>
            </div>
            <span class="font-display font-bold text-lg tracking-tight text-white">Ma Boutique</span>
          </a>
          <div class="hidden md:flex items-center gap-1">
            <a href="#/" class="px-3 py-1.5 rounded-lg text-sm text-zinc-400
              hover:text-white hover:bg-[#1a1a26] transition-all duration-200">Produits</a>
            <a href="#/stats" class="px-3 py-1.5 rounded-lg text-sm text-zinc-400
              hover:text-white hover:bg-[#1a1a26] transition-all duration-200">Statistiques</a>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <form id="nav-search-form" class="relative hidden sm:block">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <input id="nav-search-input" type="text" placeholder="Rechercher..."
              class="pl-9 pr-4 py-2 rounded-xl bg-[#1a1a26] border border-[#252535] text-sm
                text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#c8f04a88]
                focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200 w-44" />
          </form>

          <a href="#/cart" class="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#252535]
            text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-[#1a1a26]
            transition-all duration-200 text-sm">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0
                   00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114
                   0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0
                   .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            Panier
            <span id="cart-badge" class="${cartCount === 0 ? 'hidden' : ''}
              absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c8f04a] text-[#0a0a0f]
              text-xs font-bold flex items-center justify-center">${escapeHtml(String(cartCount))}</span>
          </a>

          ${authenticated && user ? `
            <div class="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1a1a26] border border-[#252535]">
              <div class="w-6 h-6 rounded-full bg-[#c8f04a22] border border-[#c8f04a44]
                flex items-center justify-center flex-shrink-0">
                <span class="font-display font-semibold text-xs text-[#c8f04a]">${escapeHtml((user.email || '?')[0].toUpperCase())}</span>
              </div>
              <span class="text-sm text-zinc-300 font-medium">${escapeHtml(user.email || '')}</span>
            </div>
          ` : ''}

          ${authLinks}
        </div>
      </div>
    </nav>
  `;

  // Recherche
  const form = document.getElementById('nav-search-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('nav-search-input').value.trim();
      if (query) navigateTo(`/search?q=${encodeURIComponent(query)}`);
    });
  }

  // Déconnexion
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try { await logout(); } catch { /* déconnexion locale quand même */ }
      clearAuth();
      clearCsrfToken();
      renderNavbar();
      navigateTo('/');
    });
  }
};

/** Met à jour le badge panier. */
export const updateCartBadge = () => {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = String(count);
  badge.classList.toggle('hidden', count === 0);
};

window.addEventListener('cart-updated', updateCartBadge);
