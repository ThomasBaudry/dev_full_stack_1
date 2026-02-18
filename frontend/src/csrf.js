/**
 * Module de gestion du token CSRF.
 * Récupère le token depuis le backend et le met en cache.
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

/** Retourne le token CSRF en cache, ou le récupère si besoin. */
export const getCsrfToken = async () => {
  if (csrfTokenCache) return csrfTokenCache;
  return fetchCsrfToken();
};

/** Invalide le cache du token CSRF (à appeler après déconnexion par ex.). */
export const clearCsrfToken = () => {
  csrfTokenCache = null;
};

/** Crée un champ <input type="hidden"> avec le token CSRF pour les formulaires. */
export const csrfHiddenField = async () => {
  const token = await getCsrfToken();
  return token
    ? `<input type="hidden" name="_csrf" value="${token}" />`
    : '';
};
