/**
 * Page Panier — gestion côté client avec localStorage.
 */

import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '../cart.js';
import { escapeHtml, formatPrice } from '../utils.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu d'une ligne du panier. */
const cartRow = (item) => `
  <tr>
    <td>
      <div class="d-flex align-items-center">
        ${item.image
          ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"
              class="me-3 rounded" style="width: 60px; height: 60px; object-fit: cover;" />`
          : ''}
        <a href="#/product/${escapeHtml(String(item.productId))}" class="text-decoration-none">
          ${escapeHtml(item.name)}
        </a>
      </div>
    </td>
    <td>${escapeHtml(formatPrice(item.price))}</td>
    <td>
      <div class="input-group input-group-sm" style="width: 130px;">
        <button class="btn btn-outline-secondary qty-btn" data-id="${escapeHtml(String(item.productId))}" data-action="decrease">−</button>
        <input type="number" class="form-control text-center qty-input" value="${item.quantity}" min="1" max="99"
          data-id="${escapeHtml(String(item.productId))}" readonly />
        <button class="btn btn-outline-secondary qty-btn" data-id="${escapeHtml(String(item.productId))}" data-action="increase">+</button>
      </div>
    </td>
    <td class="fw-bold">${escapeHtml(formatPrice(item.price * item.quantity))}</td>
    <td>
      <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${escapeHtml(String(item.productId))}">
        Supprimer
      </button>
    </td>
  </tr>
`;

/** Rendu de la page panier. */
export const renderCartPage = (container) => {
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <h2 class="mb-4">Mon Panier</h2>
      <div class="alert alert-info">Votre panier est vide.</div>
      <a href="#/" class="btn btn-primary">Continuer mes achats</a>
    `;
    return;
  }

  const total = getCartTotal();

  container.innerHTML = `
    <h2 class="mb-4">Mon Panier</h2>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Produit</th>
            <th>Prix unitaire</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(cartRow).join('')}
        </tbody>
        <tfoot>
          <tr class="table-light">
            <td colspan="3" class="text-end fw-bold">Total :</td>
            <td class="fw-bold text-primary fs-5">${escapeHtml(formatPrice(total))}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="d-flex justify-content-between">
      <a href="#/" class="btn btn-outline-primary">Continuer mes achats</a>
      <div>
        <button class="btn btn-outline-danger me-2" id="clear-cart-btn">Vider le panier</button>
      </div>
    </div>
  `;

  // Événements de quantité (+ / -)
  container.querySelectorAll('.qty-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.id;
      const current = cart.find((i) => String(i.productId) === productId);
      if (!current) return;
      const newQty = btn.dataset.action === 'increase'
        ? current.quantity + 1
        : current.quantity - 1;
      updateQuantity(Number(productId) || productId, newQty);
      renderNavbar();
      renderCartPage(container);
    });
  });

  // Événements de suppression
  container.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.id) || btn.dataset.id);
      renderNavbar();
      renderCartPage(container);
    });
  });

  // Vider le panier
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart();
      renderNavbar();
      renderCartPage(container);
    }
  });
};
