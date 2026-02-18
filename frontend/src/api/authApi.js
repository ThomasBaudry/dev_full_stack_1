/**
 * API Authentification.
 */

import { post } from './http.js';

/** Inscription. */
export const register = (email, password) =>
  post('/auth/register', { email, password });

/** Connexion. */
export const login = (email, password) =>
  post('/auth/login', { email, password });

/** Déconnexion. */
export const logout = () => post('/auth/logout', {});
