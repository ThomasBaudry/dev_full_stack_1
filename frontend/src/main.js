/**
 * Point d'entrée de l'application frontend.
 * Initialise Bootstrap, le routeur et les composants globaux.
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.css';

import { addRoute, setNotFound, startRouter } from './router.js';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderProduct } from './pages/product.js';
import { renderSearch } from './pages/search.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderCartPage } from './pages/cartPage.js';
import { renderStats } from './pages/stats.js';
import { renderDashboard } from './pages/dashboard.js';
import { fetchCsrfToken } from './csrf.js';

/** Enregistrement des routes. */
const registerRoutes = () => {
  addRoute('/', renderHome);
  addRoute('/home', renderHome);
  addRoute('/product/:id', renderProduct);
  addRoute('/search', renderSearch);
  addRoute('/login', renderLogin);
  addRoute('/register', renderRegister);
  addRoute('/cart', renderCartPage);
  addRoute('/stats', renderStats);
  addRoute('/dashboard', renderDashboard);

  setNotFound((container) => {
    container.innerHTML = `
      <div class="text-center py-5">
        <h1 class="display-1 text-muted">404</h1>
        <p class="lead">Page introuvable</p>
        <a href="#/" class="btn btn-primary">Retour à l'accueil</a>
      </div>
    `;
  });
};

/** Initialisation de l'application. */
const init = async () => {
  renderNavbar();
  renderFooter();
  registerRoutes();

  // Pré-charger le token CSRF
  await fetchCsrfToken().catch(() => {});

  startRouter();
};

// Re-rendre la navbar à chaque changement de route
window.addEventListener('hashchange', () => renderNavbar());

// Démarrage
init();
