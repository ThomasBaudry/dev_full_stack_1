/**
 * API Produits.
 */

import { get, del, post, put } from './http.js';

/** Récupère tous les produits. */
export const fetchProducts = () => get('/products');

/** Récupère un produit par ID. */
export const fetchProduct = (id) => get(`/products/${encodeURIComponent(id)}`);

/** Recherche de produits par mot-clé. */
export const searchProducts = (query) =>
  get(`/products/search?q=${encodeURIComponent(query)}`);

/** Crée un produit (JSON + images base64). */
export const createProduct = (payload) => post('/products', payload);

/** Met à jour un produit (JSON + images base64). */
export const updateProduct = (id, payload) =>
  put(`/products/${encodeURIComponent(id)}`, payload);

/** Supprime un produit. */
export const deleteProduct = (id) => del(`/products/${encodeURIComponent(id)}`);
