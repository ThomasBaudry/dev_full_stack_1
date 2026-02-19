/**
 * Point d'entree applicatif - enregistrement des routes et demarrage du routeur.
 */

import { addRoute, setNotFound, startRouter } from './router/router.js';
import { renderNavbar } from './components/navbar.js';
import { renderProductsPage } from './pages/productsPage.js';
import { renderProductDetailPage } from './pages/productDetailPage.js';
import { renderLoginPage } from './pages/loginPage.js';
import { renderRegisterPage } from './pages/registerPage.js';
import { renderCartPage } from './pages/cartPage.js';
import { renderStatsPage } from './pages/statsPage.js';
import { renderDashboard } from './pages/dashboardPage.js';
import { renderSearchPage } from './pages/searchPage.js';
import { renderCspReportsPage } from './pages/cspReportsPage.js';
import { fetchCsrfToken } from './api/http.js';
import { isAuthenticated } from './store/authStore.js';
import { navigateTo } from './router/router.js';

const withAuth = (handler) => (container, params, query) => {
  if (!isAuthenticated()) {
    navigateTo('/login');
    return;
  }
  handler(container, params, query);
};

/** Enregistrement des routes. */
const registerRoutes = () => {
  addRoute('/', renderProductsPage);
  addRoute('/home', renderProductsPage);
  addRoute('/product/:id', renderProductDetailPage);
  addRoute('/search', renderSearchPage);
  addRoute('/login', renderLoginPage);
  addRoute('/register', renderRegisterPage);
  addRoute('/cart', renderCartPage);
  addRoute('/stats', renderStatsPage);
  addRoute('/dashboard', withAuth(renderDashboard));
  addRoute('/csp-reports', withAuth(renderCspReportsPage));

  setNotFound((container) => {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20">
        <h1 class="font-display text-6xl font-extrabold text-zinc-700">404</h1>
        <p class="text-zinc-500 mt-2">Page introuvable</p>
        <a href="#/" class="mt-4 px-5 py-2.5 rounded-xl bg-[#c8f04a] text-[#0a0a0f]
          font-display font-semibold text-sm">Retour a l'accueil</a>
      </div>`;
  });
};

/** Initialisation de l'application. */
export const renderApp = async () => {
  renderNavbar();
  registerRoutes();

  // Pre-charger le token CSRF
  await fetchCsrfToken().catch(() => {});

  startRouter();

  // Re-rendre la navbar a chaque changement de route
  window.addEventListener('hashchange', () => renderNavbar());
};
