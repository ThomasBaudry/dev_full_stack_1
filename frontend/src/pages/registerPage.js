/**
 * Page d'inscription — validation NIST SP 800-63B en temps réel.
 */

import { register } from '../api/authApi.js';
import { setAuth, validatePassword } from '../store/authStore.js';
import { escapeHtml } from '../utils.js';
import { csrfHiddenField } from '../api/http.js';
import { navigateTo } from '../router/router.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu de la page d'inscription. */
export const renderRegisterPage = async (container) => {
  const csrfField = await csrfHiddenField();

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-[#c8f04a] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0
                   016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109"/>
            </svg>
          </div>
          <h1 class="font-display font-extrabold text-2xl text-white">Inscription</h1>
          <p class="text-zinc-600 text-sm mt-1">Créez votre compte</p>
        </div>

        <div class="bg-[#111118] border border-[#1a1a26] rounded-2xl p-6">
          <div id="register-error" class="hidden mb-4 px-4 py-3 rounded-xl bg-red-900/10
            border border-red-900/30 text-red-400 text-sm"></div>
          <div id="register-success" class="hidden mb-4 px-4 py-3 rounded-xl bg-emerald-900/10
            border border-emerald-900/30 text-emerald-400 text-sm"></div>

          <form id="register-form" novalidate>
            ${csrfField}
            <div class="mb-4">
              <label for="reg-email" class="block text-xs font-display font-semibold text-zinc-500
                uppercase tracking-widest mb-2">E-mail</label>
              <input type="email" id="reg-email" required autocomplete="email"
                placeholder="votre@email.fr"
                class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                  text-white placeholder-zinc-600 text-sm focus:outline-none
                  focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
            </div>

            <div class="mb-4">
              <label for="reg-password" class="block text-xs font-display font-semibold text-zinc-500
                uppercase tracking-widest mb-2">Mot de passe</label>
              <div class="relative">
                <input type="password" id="reg-password" required autocomplete="new-password"
                  placeholder="Au moins 8 caractères"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                    text-white placeholder-zinc-600 text-sm focus:outline-none
                    focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200 pr-20" />
                <button type="button" id="toggle-reg-password"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500
                    hover:text-[#c8f04a] transition-colors">Afficher</button>
              </div>
              <div id="password-feedback" class="mt-2 text-xs"></div>
            </div>

            <div class="mb-6">
              <label for="reg-password-confirm" class="block text-xs font-display font-semibold text-zinc-500
                uppercase tracking-widest mb-2">Confirmer</label>
              <input type="password" id="reg-password-confirm" required autocomplete="new-password"
                placeholder="Confirmez votre mot de passe"
                class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                  text-white placeholder-zinc-600 text-sm focus:outline-none
                  focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
            </div>

            <button type="submit" id="register-submit"
              class="w-full py-3 rounded-xl bg-[#c8f04a] hover:bg-[#b5e030] text-[#0a0a0f]
                font-display font-semibold text-sm transition-all duration-200">
              Créer mon compte
            </button>
          </form>
        </div>

        <p class="text-center text-zinc-600 text-sm mt-4">
          Déjà un compte ?
          <a href="#/login" class="text-[#c8f04a] hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  `;

  const pwInput = document.getElementById('reg-password');
  const feedbackDiv = document.getElementById('password-feedback');

  // Toggle mot de passe
  document.getElementById('toggle-reg-password').addEventListener('click', () => {
    const show = pwInput.type === 'password';
    pwInput.type = show ? 'text' : 'password';
    document.getElementById('toggle-reg-password').textContent = show ? 'Masquer' : 'Afficher';
  });

  // Validation temps réel
  pwInput.addEventListener('input', () => {
    const errors = validatePassword(pwInput.value);
    if (pwInput.value.length === 0) {
      feedbackDiv.innerHTML = '';
    } else if (errors.length === 0) {
      feedbackDiv.innerHTML = '<span class="text-emerald-400">Mot de passe valide.</span>';
    } else {
      feedbackDiv.innerHTML = errors
        .map((e) => `<span class="text-red-400">${escapeHtml(e)}</span>`)
        .join('<br/>');
    }
  });

  // Soumission
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = pwInput.value;
    const confirm = document.getElementById('reg-password-confirm').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    const submitBtn = document.getElementById('register-submit');

    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    const errors = [];
    if (!email) errors.push("L'adresse e-mail est requise.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("L'adresse e-mail n'est pas valide.");
    errors.push(...validatePassword(password));
    if (password !== confirm) errors.push('Les mots de passe ne correspondent pas.');

    if (errors.length > 0) {
      errorDiv.innerHTML = errors.map((e) => escapeHtml(e)).join('<br/>');
      errorDiv.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription…';

    try {
      const data = await register(email, password);
      if (data.token) {
        setAuth(data.token, data.user || { email });
        renderNavbar();
        navigateTo('/dashboard');
      } else {
        successDiv.textContent = 'Compte créé ! Vous pouvez maintenant vous connecter.';
        successDiv.classList.remove('hidden');
      }
    } catch (err) {
      errorDiv.textContent = escapeHtml(err.message || "Erreur lors de l'inscription.");
      errorDiv.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Créer mon compte';
    }
  });
};
