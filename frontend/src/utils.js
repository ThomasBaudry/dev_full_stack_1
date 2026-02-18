/**
 * Utilitaires : échappement XSS, formatage, helpers.
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

/** Tronque un texte. */
export const truncate = (text, max = 100) =>
  text.length > max ? `${text.slice(0, max)}…` : text;
