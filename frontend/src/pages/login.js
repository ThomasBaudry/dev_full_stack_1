/**
 * Page de connexion.
 */

import { login as apiLogin } from '../api.js';
import { setAuth } from '../auth.js';
import { escapeHtml } from '../utils.js';
import { csrfHiddenField } from '../csrf.js';
import { navigateTo } from '../router.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu de la page de connexion. */
export const renderLogin = async (container) => {
  const csrfField = await csrfHiddenField();

  container.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Connexion</h2>
            <div id="login-error" class="alert alert-danger d-none"></div>
            <form id="login-form" novalidate>
              ${csrfField}
              <div class="mb-3">
                <label for="login-email" class="form-label">Adresse e-mail</label>
                <input type="email" class="form-control" id="login-email" required
                  autocomplete="email" placeholder="votre@email.fr" />
                <div class="invalid-feedback">Veuillez entrer une adresse e-mail valide.</div>
              </div>
              <div class="mb-3">
                <label for="login-password" class="form-label">Mot de passe</label>
                <div class="input-group">
                  <input type="password" class="form-control" id="login-password" required
                    autocomplete="current-password" placeholder="Votre mot de passe" />
                  <button class="btn btn-outline-secondary" type="button" id="toggle-password"
                    aria-label="Afficher le mot de passe">
                    Afficher
                  </button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100" id="login-submit">Se connecter</button>
            </form>
            <p class="text-center mt-3">
              Pas encore de compte ? <a href="#/register">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Toggle affichage mot de passe
  const passwordInput = document.getElementById('login-password');
  document.getElementById('toggle-password').addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    document.getElementById('toggle-password').textContent = isPassword ? 'Masquer' : 'Afficher';
  });

  // Soumission du formulaire
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = passwordInput.value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');

    // Validation basique côté client
    if (!email || !password) {
      errorDiv.textContent = 'Veuillez remplir tous les champs.';
      errorDiv.classList.remove('d-none');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion en cours…';
    errorDiv.classList.add('d-none');

    try {
      const data = await apiLogin(email, password);
      setAuth(data.token, data.user || { email });
      renderNavbar();
      navigateTo('/dashboard');
    } catch (err) {
      errorDiv.textContent = escapeHtml(err.message || 'Identifiants incorrects.');
      errorDiv.classList.remove('d-none');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Se connecter';
    }
  });
};
