/**
 * Composant Navbar Bootstrap.
 * Affiche la barre de navigation avec recherche, panier et liens auth.
 */

import { escapeHtml } from '../utils.js';
import { isAuthenticated, clearAuth } from '../auth.js';
import { getCartCount } from '../cart.js';
import { navigateTo } from '../router.js';
import { logout } from '../api.js';
import { clearCsrfToken } from '../csrf.js';

/** Génère le HTML de la navbar et l'injecte dans #navbar. */
export const renderNavbar = () => {
  const authenticated = isAuthenticated();
  const cartCount = getCartCount();

  const authLinks = authenticated
    ? `
      <li class="nav-item">
        <a class="nav-link" href="#/dashboard">Dashboard</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="logout-btn">Déconnexion</a>
      </li>
    `
    : `
      <li class="nav-item">
        <a class="nav-link" href="#/login">Connexion</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#/register">Inscription</a>
      </li>
    `;

  const html = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#/">Ma Boutique</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarMain" aria-controls="navbarMain"
          aria-expanded="false" aria-label="Basculer la navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#/">Accueil</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/stats">Statistiques</a>
            </li>
            ${authLinks}
          </ul>
          <form class="d-flex me-3" id="search-form" role="search">
            <input class="form-control me-2" type="search" id="search-input"
              placeholder="Rechercher un produit…" aria-label="Rechercher" />
            <button class="btn btn-outline-light" type="submit">Rechercher</button>
          </form>
          <a href="#/cart" class="btn btn-outline-light position-relative">
            Panier
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${cartCount === 0 ? 'd-none' : ''}" id="cart-badge">
              ${escapeHtml(String(cartCount))}
            </span>
          </a>
        </div>
      </div>
    </nav>
  `;

  const container = document.getElementById('navbar');
  container.innerHTML = html;

  // Gestion de la recherche
  const form = document.getElementById('search-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) navigateTo(`/search?q=${encodeURIComponent(query)}`);
  });

  // Gestion de la déconnexion
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await logout();
      } catch {
        // On déconnecte côté client même si l'API échoue
      }
      clearAuth();
      clearCsrfToken();
      renderNavbar();
      navigateTo('/');
    });
  }
};

/** Met à jour le badge du panier. */
export const updateCartBadge = () => {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = String(count);
  badge.classList.toggle('d-none', count === 0);
};

// Écoute les mises à jour du panier
window.addEventListener('cart-updated', updateCartBadge);
