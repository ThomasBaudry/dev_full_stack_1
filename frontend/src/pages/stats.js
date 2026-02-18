/**
 * Page Statistiques — affichage des catégories et nombre de produits.
 * Données récupérées depuis l'API /api/stats (accessible à toutes les IP).
 */

import { fetchStats } from '../api.js';
import { escapeHtml } from '../utils.js';

/** Génère une barre horizontale CSS pour le graphique. */
const statBar = (category, maxCount) => {
  const percentage = maxCount > 0 ? Math.round((category.compte / maxCount) * 100) : 0;
  return `
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1">
        <span class="fw-semibold">${escapeHtml(category.nom)}</span>
        <span class="text-muted">${escapeHtml(String(category.compte))} produit${category.compte > 1 ? 's' : ''}</span>
      </div>
      <div class="progress" style="height: 25px;">
        <div class="progress-bar" role="progressbar" style="width: ${percentage}%"
          aria-valuenow="${category.compte}" aria-valuemin="0" aria-valuemax="${maxCount}">
          ${percentage}%
        </div>
      </div>
    </div>
  `;
};

/** Génère le tableau des statistiques. */
const statTable = (stats) => `
  <table class="table table-striped table-hover">
    <thead class="table-dark">
      <tr>
        <th>Catégorie</th>
        <th>Nombre de produits</th>
      </tr>
    </thead>
    <tbody>
      ${stats
        .map(
          (s) => `
        <tr>
          <td>${escapeHtml(s.nom)}</td>
          <td><span class="badge bg-primary rounded-pill">${escapeHtml(String(s.compte))}</span></td>
        </tr>`,
        )
        .join('')}
    </tbody>
  </table>
`;

/** Rendu de la page statistiques. */
export const renderStats = async (container) => {
  container.innerHTML = `
    <h2 class="mb-4">Statistiques par catégorie</h2>
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement…</span>
      </div>
    </div>
  `;

  try {
    const stats = await fetchStats();
    const data = Array.isArray(stats) ? stats : [];

    if (data.length === 0) {
      container.innerHTML = `
        <h2 class="mb-4">Statistiques par catégorie</h2>
        <div class="alert alert-info">Aucune statistique disponible.</div>
      `;
      return;
    }

    const maxCount = Math.max(...data.map((s) => s.compte));

    container.innerHTML = `
      <h2 class="mb-4">Statistiques par catégorie</h2>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">Graphique</h5>
            </div>
            <div class="card-body">
              ${data.map((s) => statBar(s, maxCount)).join('')}
            </div>
          </div>
        </div>
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">Tableau détaillé</h5>
            </div>
            <div class="card-body p-0">
              ${statTable(data)}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <h2 class="mb-4">Statistiques par catégorie</h2>
      <div class="alert alert-danger">
        Impossible de charger les statistiques.
        <br /><small>${escapeHtml(err.message)}</small>
      </div>
    `;
  }
};
