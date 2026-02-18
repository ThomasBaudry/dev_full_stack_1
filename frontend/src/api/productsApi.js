/**
 * API Produits.
 */

import { get, del, postForm, putForm } from './http.js';

/** Récupère tous les produits. */
export const fetchProducts = () => get('/products');

/** Récupère un produit par ID. */
export const fetchProduct = (id) => get(`/products/${encodeURIComponent(id)}`);

/** Recherche de produits par mot-clé. */
export const searchProducts = (query) =>
  get(`/products/search?q=${encodeURIComponent(query)}`);

/** Crée un produit (FormData pour images). */
export const createProduct = (formData) => postForm('/products', formData);

/** Met à jour un produit. */
export const updateProduct = (id, formData) =>
  putForm(`/products/${encodeURIComponent(id)}`, formData);

/** Supprime un produit. */
export const deleteProduct = (id) => del(`/products/${encodeURIComponent(id)}`);
