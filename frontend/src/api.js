/**
 * Module API : toutes les fonctions de communication avec le backend.
 * Le backend tourne sur localhost:5000.
 * Chaque fonction retourne une Promise (style fonctionnel, asynchrone).
 */

import { getCsrfToken } from './csrf.js';

const API_BASE = 'http://localhost:5000/api';

/** Construit les headers standards pour les requêtes JSON + CSRF. */
const jsonHeaders = async () => {
  const csrf = await getCsrfToken();
  return {
    'Content-Type': 'application/json',
    ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
  };
};

/** Effectue un fetch puis parse la réponse JSON. Lance une erreur si !ok. */
const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.message || `Erreur ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
};

// ── Produits ──────────────────────────────────────────────

/** Récupère tous les produits. */
export const fetchProducts = () => request(`${API_BASE}/products`);

/** Récupère un produit par son identifiant. */
export const fetchProduct = (id) => request(`${API_BASE}/products/${encodeURIComponent(id)}`);

/** Recherche de produits par mot-clé. */
export const searchProducts = (query) =>
  request(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);

// ── Authentification ──────────────────────────────────────

/** Inscription d'un nouvel utilisateur. */
export const register = async (email, password) =>
  request(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: await jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });

/** Connexion. */
export const login = async (email, password) =>
  request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: await jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });

/** Déconnexion. */
export const logout = async () =>
  request(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: await jsonHeaders(),
  });

// ── Panier (API backend) ─────────────────────────────────

/** Récupère le panier côté serveur (optionnel, utilisé si connecté). */
export const fetchCart = () => request(`${API_BASE}/cart`);

/** Ajoute un produit au panier côté serveur. */
export const addToCartApi = async (productId, quantity = 1) =>
  request(`${API_BASE}/cart`, {
    method: 'POST',
    headers: await jsonHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

// ── Statistiques ─────────────────────────────────────────

/** Récupère les statistiques (catégories + nombre de produits). */
export const fetchStats = () => request(`${API_BASE}/stats`);

// ── CRUD Produits (authentifié) ──────────────────────────

/** Ajoute un nouveau produit (avec images en FormData). */
export const createProduct = async (formData) => {
  const csrf = await getCsrfToken();
  return request(`${API_BASE}/products`, {
    method: 'POST',
    headers: csrf ? { 'X-CSRF-Token': csrf } : {},
    body: formData, // FormData — le navigateur gère le Content-Type
  });
};

/** Met à jour un produit existant. */
export const updateProduct = async (id, formData) => {
  const csrf = await getCsrfToken();
  return request(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: csrf ? { 'X-CSRF-Token': csrf } : {},
    body: formData,
  });
};

/** Supprime un produit. */
export const deleteProduct = async (id) =>
  request(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: await jsonHeaders(),
  });
