/**
 * Point d'entrée applicatif — enregistrement des routes et démarrage du routeur.
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
import { fetchCsrfToken } from './api/http.js';
import { searchProducts } from './api/productsApi.js';
import { productCard } from './components/productCard.js';
import { addToCart } from './store/cartStore.js';
import { escapeHtml } from './utils.js';

/** Page de recherche. */
const renderSearchPage = async (container, _params, query) => {
  const q = query.q || '';
  if (!q) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <h2 class="font-display font-extrabold text-3xl text-white">Recherche</h2>
        <p class="text-zinc-500 text-sm mt-2">Veuillez saisir un terme de recherche.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-10">
      <h2 class="font-display font-extrabold text-3xl text-white mb-6">
        Résultats pour « ${escapeHtml(q)} »
      </h2>
      <div class="flex justify-center py-20">
        <div class="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>`;

  try {
    const results = await searchProducts(q);
    const products = Array.isArray(results) ? results : [];

    if (products.length === 0) {
      container.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 py-10">
          <h2 class="font-display font-extrabold text-3xl text-white mb-4">
            Résultats pour « ${escapeHtml(q)} »
          </h2>
          <p class="text-zinc-500 text-sm">Aucun produit trouvé.</p>
          <a href="#/" class="inline-block mt-4 px-5 py-2.5 rounded-xl border border-[#252535]
            text-zinc-400 hover:text-white text-sm">Retour</a>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <h2 class="font-display font-extrabold text-3xl text-white mb-1">
          Résultats pour « ${escapeHtml(q)} »
        </h2>
        <p class="text-zinc-500 text-sm mb-6">${products.length} résultat${products.length > 1 ? 's' : ''}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          ${products.map(productCard).join('')}
        </div>
      </div>`;

    container.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.productId;
        const product = products.find((p) => String(p.id) === id);
        if (product) {
          addToCart(product);
          renderNavbar();
          btn.textContent = 'Ajouté !';
          setTimeout(() => { btn.textContent = 'Ajouter au panier'; }, 1500);
        }
      });
    });
  } catch (err) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-10">
        <h2 class="font-display font-extrabold text-3xl text-white mb-4">Recherche</h2>
        <div class="rounded-2xl border border-red-900/40 bg-red-900/10 p-6 text-center">
          <p class="text-red-400 text-sm">Erreur lors de la recherche.</p>
          <p class="text-red-500/60 text-xs mt-1">${escapeHtml(err.message)}</p>
        </div>
      </div>`;
  }
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
  addRoute('/dashboard', renderDashboard);

  setNotFound((container) => {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20">
        <h1 class="font-display text-6xl font-extrabold text-zinc-700">404</h1>
        <p class="text-zinc-500 mt-2">Page introuvable</p>
        <a href="#/" class="mt-4 px-5 py-2.5 rounded-xl bg-[#c8f04a] text-[#0a0a0f]
          font-display font-semibold text-sm">Retour à l'accueil</a>
      </div>`;
  });
};

/** Initialisation de l'application. */
export const renderApp = async () => {
  renderNavbar();
  registerRoutes();

  // Pré-charger le token CSRF
  await fetchCsrfToken().catch(() => {});

  startRouter();

  // Re-rendre la navbar à chaque changement de route
  window.addEventListener('hashchange', () => renderNavbar());
};
