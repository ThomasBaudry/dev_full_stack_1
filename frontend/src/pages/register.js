/**
 * Page d'inscription avec validation du mot de passe (NIST SP 800-63B).
 */

import { register as apiRegister } from '../api.js';
import { setAuth, validatePassword } from '../auth.js';
import { escapeHtml } from '../utils.js';
import { csrfHiddenField } from '../csrf.js';
import { navigateTo } from '../router.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu de la page d'inscription. */
export const renderRegister = async (container) => {
  const csrfField = await csrfHiddenField();

  container.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Inscription</h2>
            <div id="register-error" class="alert alert-danger d-none"></div>
            <div id="register-success" class="alert alert-success d-none"></div>
            <form id="register-form" novalidate>
              ${csrfField}
              <div class="mb-3">
                <label for="register-email" class="form-label">Adresse e-mail</label>
                <input type="email" class="form-control" id="register-email" required
                  autocomplete="email" placeholder="votre@email.fr" />
                <div class="invalid-feedback">Veuillez entrer une adresse e-mail valide.</div>
              </div>
              <div class="mb-3">
                <label for="register-password" class="form-label">Mot de passe</label>
                <div class="input-group">
                  <input type="password" class="form-control" id="register-password" required
                    autocomplete="new-password" placeholder="Au moins 8 caractères" />
                  <button class="btn btn-outline-secondary" type="button" id="toggle-reg-password"
                    aria-label="Afficher le mot de passe">
                    Afficher
                  </button>
                </div>
                <div id="password-feedback" class="form-text"></div>
              </div>
              <div class="mb-3">
                <label for="register-password-confirm" class="form-label">Confirmer le mot de passe</label>
                <input type="password" class="form-control" id="register-password-confirm" required
                  autocomplete="new-password" placeholder="Confirmez votre mot de passe" />
                <div class="invalid-feedback">Les mots de passe ne correspondent pas.</div>
              </div>
              <button type="submit" class="btn btn-primary w-100" id="register-submit">Créer mon compte</button>
            </form>
            <p class="text-center mt-3">
              Déjà un compte ? <a href="#/login">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const passwordInput = document.getElementById('register-password');
  const confirmInput = document.getElementById('register-password-confirm');
  const feedbackDiv = document.getElementById('password-feedback');

  // Toggle affichage mot de passe
  document.getElementById('toggle-reg-password').addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    document.getElementById('toggle-reg-password').textContent = isPassword ? 'Masquer' : 'Afficher';
  });

  // Validation en temps réel du mot de passe
  passwordInput.addEventListener('input', () => {
    const errors = validatePassword(passwordInput.value);
    if (errors.length === 0 && passwordInput.value.length > 0) {
      feedbackDiv.innerHTML = '<span class="text-success">Mot de passe valide.</span>';
      passwordInput.classList.remove('is-invalid');
      passwordInput.classList.add('is-valid');
    } else if (passwordInput.value.length > 0) {
      feedbackDiv.innerHTML = errors
        .map((e) => `<span class="text-danger">${escapeHtml(e)}</span>`)
        .join('<br/>');
      passwordInput.classList.remove('is-valid');
      passwordInput.classList.add('is-invalid');
    } else {
      feedbackDiv.innerHTML = '';
      passwordInput.classList.remove('is-valid', 'is-invalid');
    }
  });

  // Soumission du formulaire
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    const submitBtn = document.getElementById('register-submit');

    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');

    // Validations côté client
    const errors = [];
    if (!email) errors.push('L\'adresse e-mail est requise.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('L\'adresse e-mail n\'est pas valide.');
    errors.push(...validatePassword(password));
    if (password !== confirm) errors.push('Les mots de passe ne correspondent pas.');

    if (errors.length > 0) {
      errorDiv.innerHTML = errors.map((e) => escapeHtml(e)).join('<br/>');
      errorDiv.classList.remove('d-none');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription en cours…';

    try {
      const data = await apiRegister(email, password);
      if (data.token) {
        setAuth(data.token, data.user || { email });
        renderNavbar();
        navigateTo('/dashboard');
      } else {
        successDiv.textContent = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        successDiv.classList.remove('d-none');
      }
    } catch (err) {
      errorDiv.textContent = escapeHtml(err.message || 'Erreur lors de l\'inscription.');
      errorDiv.classList.remove('d-none');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Créer mon compte';
    }
  });
};
