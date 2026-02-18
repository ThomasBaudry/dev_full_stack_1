/**
 * Page Statistiques — catégories et nombre de produits.
 * Données depuis /api/stats (accessible à toutes les IP).
 */

import { fetchStats } from '../api/statsApi.js';
import { escapeHtml } from '../utils.js';

/** Barre de progression pour une catégorie. */
const statBar = (cat, maxCount) => {
  const pct = maxCount > 0 ? Math.round((cat.compte / maxCount) * 100) : 0;
  return `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="font-display font-semibold text-sm text-white">${escapeHtml(cat.nom)}</span>
        <span class="text-zinc-500 text-sm">${escapeHtml(String(cat.compte))} produit${cat.compte > 1 ? 's' : ''}</span>
      </div>
      <div class="h-3 rounded-full bg-[#1a1a26] overflow-hidden">
        <div class="h-full rounded-full bg-[#c8f04a] transition-all duration-700"
          style="width: ${pct}%"></div>
      </div>
    </div>
  `;
};

/** Rendu de la page statistiques. */
export const renderStatsPage = async (container) => {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-8">
        <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Données</p>
        <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">
          Statistiques par catégorie
        </h1>
      </div>
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>`;

  try {
    const stats = await fetchStats();
    const data = Array.isArray(stats) ? stats : [];

    if (data.length === 0) {
      container.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 py-10">
          <div class="mb-8">
            <h1 class="font-display font-extrabold text-3xl text-white">Statistiques</h1>
          </div>
          <div class="text-center py-20">
            <p class="text-zinc-500 text-sm">Aucune statistique disponible.</p>
          </div>
        </div>`;
      return;
    }

    const maxCount = Math.max(...data.map((s) => s.compte));

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <p class="text-zinc-600 text-sm font-display uppercase tracking-widest mb-1">Données</p>
          <h1 class="font-display font-extrabold text-3xl text-white tracking-tight">
            Statistiques par catégorie
          </h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Graphique en barres -->
          <div class="bg-[#111118] border border-[#1a1a26] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-[#1a1a26]">
              <h2 class="font-display font-bold text-white">Répartition</h2>
            </div>
            <div class="p-6">
              ${data.map((s) => statBar(s, maxCount)).join('')}
            </div>
          </div>

          <!-- Tableau détaillé -->
          <div class="bg-[#111118] border border-[#1a1a26] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-[#1a1a26]">
              <h2 class="font-display font-bold text-white">Détail</h2>
            </div>
            <div>
              <div class="grid grid-cols-2 px-6 py-3 border-b border-[#1a1a26]">
                <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest">Catégorie</span>
                <span class="text-xs font-display font-semibold text-zinc-600 uppercase tracking-widest text-right">Produits</span>
              </div>
              ${data.map((s) => `
                <div class="grid grid-cols-2 px-6 py-3 border-b border-[#1a1a2666] last:border-0
                  hover:bg-[#c8f04a08] transition-colors">
                  <span class="text-sm text-white font-medium">${escapeHtml(s.nom)}</span>
                  <span class="text-sm text-right">
                    <span class="inline-flex items-center justify-center w-8 h-6 rounded-lg
                      bg-[#c8f04a22] text-[#c8f04a] font-display font-bold text-xs">${escapeHtml(String(s.compte))}</span>
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <h1 class="font-display font-extrabold text-3xl text-white">Statistiques</h1>
        </div>
        <div class="rounded-2xl border border-red-900/40 bg-red-900/10 p-6 text-center">
          <p class="text-red-400 text-sm">Impossible de charger les statistiques.</p>
          <p class="text-red-500/60 text-xs mt-1">${escapeHtml(err.message)}</p>
        </div>
      </div>`;
  }
};
