/**
 * Page détail d'un produit.
 * Affiche les images (carousel), la description, le prix et le bouton panier.
 */

import { fetchProduct } from '../api.js';
import { escapeHtml, formatPrice } from '../utils.js';
import { addToCart } from '../cart.js';
import { renderNavbar } from '../components/navbar.js';

/** Génère le carousel Bootstrap pour les images du produit. */
const imageCarousel = (images, productName) => {
  const safeImages = Array.isArray(images) && images.length > 0
    ? images
    : ['https://via.placeholder.com/600x400?text=Pas+d%27image'];

  const indicators = safeImages
    .map(
      (_, i) =>
        `<button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${i}"
          ${i === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Image ${i + 1}"></button>`,
    )
    .join('');

  const slides = safeImages
    .map(
      (img, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <img src="${escapeHtml(img)}" class="d-block w-100"
            alt="${escapeHtml(productName)} - image ${i + 1}"
            style="max-height: 450px; object-fit: contain; background: #f8f9fa;" />
        </div>`,
    )
    .join('');

  return `
    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">${indicators}</div>
      <div class="carousel-inner">${slides}</div>
      ${safeImages.length > 1
        ? `
          <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Précédent</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Suivant</span>
          </button>`
        : ''}
    </div>
  `;
};

/** Rendu de la page détail produit. */
export const renderProduct = async (container, { id }) => {
  container.innerHTML = `
    <div class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement…</span>
      </div>
    </div>
  `;

  try {
    const product = await fetchProduct(id);

    container.innerHTML = `
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#/">Accueil</a></li>
          <li class="breadcrumb-item active" aria-current="page">${escapeHtml(product.libelle || product.name)}</li>
        </ol>
      </nav>
      <div class="row">
        <div class="col-md-6 mb-4">
          ${imageCarousel(product.images, product.libelle || product.name)}
        </div>
        <div class="col-md-6">
          <h1>${escapeHtml(product.libelle || product.name)}</h1>
          <span class="badge bg-secondary mb-3">${escapeHtml(product.categorie || product.category || '')}</span>
          <h3 class="text-primary mb-3">${escapeHtml(formatPrice(product.prix || product.price))}</h3>
          <p class="lead">${escapeHtml(product.description || '')}</p>
          <button class="btn btn-primary btn-lg mt-3" id="add-to-cart-detail">
            Ajouter au panier
          </button>
          <a href="#/" class="btn btn-outline-secondary btn-lg mt-3 ms-2">Retour</a>
        </div>
      </div>
    `;

    document.getElementById('add-to-cart-detail').addEventListener('click', (e) => {
      addToCart(product);
      renderNavbar();
      e.target.textContent = 'Ajouté !';
      e.target.classList.replace('btn-primary', 'btn-success');
      setTimeout(() => {
        e.target.textContent = 'Ajouter au panier';
        e.target.classList.replace('btn-success', 'btn-primary');
      }, 1500);
    });
  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-danger">
        Impossible de charger le produit.
        <br /><small>${escapeHtml(err.message)}</small>
      </div>
      <a href="#/" class="btn btn-outline-primary">Retour à l'accueil</a>
    `;
  }
};
