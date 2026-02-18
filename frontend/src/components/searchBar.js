/**
 * Composant barre de recherche réutilisable.
 */

import { escapeHtml } from '../utils.js';
import { navigateTo } from '../router/router.js';

/** Génère et insère une barre de recherche dans le conteneur. */
export const renderSearchBar = (container, initialQuery = '') => {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative mb-6';
  wrapper.innerHTML = `
    <form id="search-bar-form" class="flex gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
        <input id="search-bar-input" type="text" placeholder="Rechercher un produit..."
          value="${escapeHtml(initialQuery)}"
          class="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a26] border border-[#252535]
            text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c8f04a88]
            focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
      </div>
      <button type="submit" class="px-6 py-3 rounded-xl bg-[#c8f04a] hover:bg-[#b5e030]
        text-[#0a0a0f] font-display font-semibold text-sm transition-all duration-200">
        Rechercher
      </button>
    </form>
  `;

  container.prepend(wrapper);

  wrapper.querySelector('#search-bar-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = wrapper.querySelector('#search-bar-input').value.trim();
    if (query) navigateTo(`/search?q=${encodeURIComponent(query)}`);
  });
};
