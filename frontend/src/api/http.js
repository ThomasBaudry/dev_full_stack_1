/**
 * Client HTTP de base avec gestion CSRF.
 * Toutes les requêtes vers le backend passent par ce module.
 */

const API_BASE = 'http://localhost:5000/api';

let csrfTokenCache = null;

/** Récupère le token CSRF depuis le backend (avec cache). */
export const fetchCsrfToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/csrf-token`, { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    csrfTokenCache = data.csrfToken || data.token || null;
    return csrfTokenCache;
  } catch {
    return null;
  }
};

/** Retourne le token CSRF en cache ou le récupère. */
export const getCsrfToken = async () =>
  csrfTokenCache || fetchCsrfToken();

/** Invalide le cache CSRF. */
export const clearCsrfToken = () => {
  csrfTokenCache = null;
};

/** Génère un champ hidden CSRF pour les formulaires. */
export const csrfHiddenField = async () => {
  const token = await getCsrfToken();
  return token ? `<input type="hidden" name="_csrf" value="${token}" />` : '';
};

/** Construit les headers JSON + CSRF. */
const jsonHeaders = async () => {
  const csrf = await getCsrfToken();
  return {
    'Content-Type': 'application/json',
    ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
  };
};

/** Effectue un fetch, parse JSON, lance une erreur si !ok. */
const request = async (url, options = {}) => {
  const response = await fetch(url, { credentials: 'include', ...options });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.message || body.error || `Erreur ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
};

/** GET request. */
export const get = (path) => request(`${API_BASE}${path}`);

/** POST request avec body JSON. */
export const post = async (path, body) =>
  request(`${API_BASE}${path}`, {
    method: 'POST',
    headers: await jsonHeaders(),
    body: JSON.stringify(body),
  });

/** PUT request avec body JSON. */
export const put = async (path, body) =>
  request(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: await jsonHeaders(),
    body: JSON.stringify(body),
  });

/** DELETE request. */
export const del = async (path) =>
  request(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: await jsonHeaders(),
  });

/** POST FormData (pour upload d'images). */
export const postForm = async (path, formData) => {
  const csrf = await getCsrfToken();
  return request(`${API_BASE}${path}`, {
    method: 'POST',
    headers: csrf ? { 'X-CSRF-Token': csrf } : {},
    body: formData,
  });
};

/** PUT FormData. */
export const putForm = async (path, formData) => {
  const csrf = await getCsrfToken();
  return request(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: csrf ? { 'X-CSRF-Token': csrf } : {},
    body: formData,
  });
};
