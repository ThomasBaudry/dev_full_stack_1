/**
 * Utilitaires : échappement XSS, formatage, helpers DOM.
 * Toutes les fonctions sont pures (sauf les helpers DOM).
 */

const ESC_MAP = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
});

/** Échappe les caractères HTML pour prévenir les failles XSS. */
export const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ESC_MAP[ch]);

/** Formate un prix en euros. */
export const formatPrice = (price) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

/** Raccourci pour querySelector. */
export const qs = (selector, parent = document) => parent.querySelector(selector);

/** Raccourci pour querySelectorAll retournant un Array. */
export const qsa = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

/** Crée un élément DOM avec attributs et enfants. */
export const createElement = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else el.setAttribute(key, value);
  });
  children
    .flat()
    .forEach((child) =>
      el.append(typeof child === 'string' ? document.createTextNode(child) : child),
    );
  return el;
};

/** Tronque un texte et ajoute « … » si nécessaire. */
export const truncate = (text, max = 100) =>
  text.length > max ? `${text.slice(0, max)}…` : text;
