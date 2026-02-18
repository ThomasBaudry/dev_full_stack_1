/**
 * Page de connexion.
 */

import { login } from '../api/authApi.js';
import { setAuth } from '../store/authStore.js';
import { escapeHtml } from '../utils.js';
import { csrfHiddenField } from '../api/http.js';
import { navigateTo } from '../router/router.js';
import { renderNavbar } from '../components/navbar.js';

/** Rendu de la page de connexion. */
export const renderLoginPage = async (container) => {
  const csrfField = await csrfHiddenField();

  container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-[#c8f04a] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>
            </svg>
          </div>
          <h1 class="font-display font-extrabold text-2xl text-white">Connexion</h1>
          <p class="text-zinc-600 text-sm mt-1">Accédez à votre espace personnel</p>
        </div>

        <div class="bg-[#111118] border border-[#1a1a26] rounded-2xl p-6">
          <div id="login-error" class="hidden mb-4 px-4 py-3 rounded-xl bg-red-900/10
            border border-red-900/30 text-red-400 text-sm"></div>

          <form id="login-form" novalidate>
            ${csrfField}
            <div class="mb-4">
              <label for="login-email" class="block text-xs font-display font-semibold text-zinc-500
                uppercase tracking-widest mb-2">E-mail</label>
              <input type="email" id="login-email" required autocomplete="email"
                placeholder="votre@email.fr"
                class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                  text-white placeholder-zinc-600 text-sm focus:outline-none
                  focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200" />
            </div>
            <div class="mb-6">
              <label for="login-password" class="block text-xs font-display font-semibold text-zinc-500
                uppercase tracking-widest mb-2">Mot de passe</label>
              <div class="relative">
                <input type="password" id="login-password" required autocomplete="current-password"
                  placeholder="Votre mot de passe"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#252535]
                    text-white placeholder-zinc-600 text-sm focus:outline-none
                    focus:border-[#c8f04a88] focus:ring-1 focus:ring-[#c8f04a22] transition-all duration-200 pr-20" />
                <button type="button" id="toggle-password"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500
                    hover:text-[#c8f04a] transition-colors">Afficher</button>
              </div>
            </div>
            <button type="submit" id="login-submit"
              class="w-full py-3 rounded-xl bg-[#c8f04a] hover:bg-[#b5e030] text-[#0a0a0f]
                font-display font-semibold text-sm transition-all duration-200">
              Se connecter
            </button>
          </form>
        </div>

        <p class="text-center text-zinc-600 text-sm mt-4">
          Pas encore de compte ?
          <a href="#/register" class="text-[#c8f04a] hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  `;

  // Toggle mot de passe
  const pwInput = document.getElementById('login-password');
  document.getElementById('toggle-password').addEventListener('click', () => {
    const show = pwInput.type === 'password';
    pwInput.type = show ? 'text' : 'password';
    document.getElementById('toggle-password').textContent = show ? 'Masquer' : 'Afficher';
  });

  // Soumission
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = pwInput.value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');

    if (!email || !password) {
      errorDiv.textContent = 'Veuillez remplir tous les champs.';
      errorDiv.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion…';
    errorDiv.classList.add('hidden');

    try {
      const data = await login(email, password);
      setAuth(data.token, data.user || { email });
      renderNavbar();
      navigateTo('/dashboard');
    } catch (err) {
      errorDiv.textContent = escapeHtml(err.message || 'Identifiants incorrects.');
      errorDiv.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Se connecter';
    }
  });
};
