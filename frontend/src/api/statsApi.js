/**
 * API Statistiques.
 */

import { get } from './http.js';

/** Récupère les catégories + nombre de produits par catégorie. */
export const fetchStats = () => get('/stats');
