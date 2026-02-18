/**
 * Page de résultats de recherche.
 */

import { searchProducts } from '../api.js';
import { escapeHtml, formatPrice, truncate } from '../utils.js';
import { addToCart } from '../cart.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu d'une carte produit dans les résultats de recherche. */
const resultCard = (product) => {
  const image = product.images && product.images.length > 0
    ? escapeHtml(product.images[0])
    : 'https://via.placeholder.com/300x200?text=Pas+d%27image';
  return `
    <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${image}" class="card-img-top" alt="${escapeHtml(product.libelle || product.name)}"
          style="height: 200px; object-fit: cover;" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">
            <a href="#/product/${escapeHtml(String(product.id))}" class="text-decoration-none text-dark">
              ${escapeHtml(product.libelle || product.name)}
            </a>
          </h5>
          <p class="card-text text-muted flex-grow-1">
            ${escapeHtml(truncate(product.description || '', 80))}
          </p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="fw-bold text-primary">${escapeHtml(formatPrice(product.prix || product.price))}</span>
            <span class="badge bg-secondary">${escapeHtml(product.categorie || product.category || '')}</span>
          </div>
          <button class="btn btn-primary mt-3 add-to-cart-btn" data-product-id="${escapeHtml(String(product.id))}">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  `;
};

/** Rendu de la page de recherche. */
export const renderSearch = async (container, _params, query) => {
  const q = query.q || '';

  if (!q) {
    container.innerHTML = `
      <h2>Recherche</h2>
      <p class="text-muted">Veuillez saisir un terme de recherche dans la barre de navigation.</p>
    `;
    return;
  }

  container.innerHTML = `
    <h2>Résultats pour « ${escapeHtml(q)} »</h2>
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement…</span>
      </div>
    </div>
  `;

  try {
    const results = await searchProducts(q);
    const products = Array.isArray(results) ? results : [];

    if (products.length === 0) {
      container.innerHTML = `
        <h2>Résultats pour « ${escapeHtml(q)} »</h2>
        <div class="alert alert-info">Aucun produit trouvé pour cette recherche.</div>
        <a href="#/" class="btn btn-outline-primary">Retour à l'accueil</a>
      `;
      return;
    }

    container.innerHTML = `
      <h2>Résultats pour « ${escapeHtml(q)} » <small class="text-muted">(${products.length} résultat${products.length > 1 ? 's' : ''})</small></h2>
      <div class="row" id="search-results">
        ${products.map(resultCard).join('')}
      </div>
    `;

    // Attacher les événements « ajouter au panier »
    container.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.productId;
        const product = products.find((p) => String(p.id) === id);
        if (product) {
          addToCart(product);
          renderNavbar();
          btn.textContent = 'Ajouté !';
          btn.classList.replace('btn-primary', 'btn-success');
          setTimeout(() => {
            btn.textContent = 'Ajouter au panier';
            btn.classList.replace('btn-success', 'btn-primary');
          }, 1500);
        }
      });
    });
  } catch (err) {
    container.innerHTML = `
      <h2>Résultats pour « ${escapeHtml(q)} »</h2>
      <div class="alert alert-danger">
        Erreur lors de la recherche.
        <br /><small>${escapeHtml(err.message)}</small>
      </div>
    `;
  }
};
