/**
 * Page Dashboard — espace connecté (vide par défaut).
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié.
 */

import { isAuthenticated, getCurrentUser } from '../auth.js';
import { escapeHtml } from '../utils.js';
import { navigateTo } from '../router.js';

/** Rendu du dashboard. */
export const renderDashboard = (container) => {
  if (!isAuthenticated()) {
    navigateTo('/login');
    return;
  }

  const user = getCurrentUser();

  container.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body text-center p-5">
            <h2 class="mb-3">Dashboard</h2>
            <p class="text-muted mb-4">
              Bienvenue${user && user.email ? `, ${escapeHtml(user.email)}` : ''} !
            </p>
            <hr />
            <p class="text-muted">
              Cet espace est réservé aux utilisateurs connectés.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
};
