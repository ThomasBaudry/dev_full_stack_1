/**
 * Routeur hash-based minimal.
 * Chaque route mappe un pattern vers une fonction render(container, params, query).
 */

const routes = [];
let notFoundHandler = null;

/** Enregistre une route. Le pattern peut contenir :param (ex: /product/:id). */
export const addRoute = (pattern, handler) => {
  const paramNames = [];
  const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  routes.push({ regex: new RegExp(`^${regexStr}$`), paramNames, handler });
};

/** Enregistre le handler 404. */
export const setNotFound = (handler) => {
  notFoundHandler = handler;
};

/** Parse la query string. */
const parseQuery = (queryStr) =>
  Object.fromEntries(new URLSearchParams(queryStr));

/** Navigue vers un hash donné. */
export const navigateTo = (hash) => {
  window.location.hash = hash;
};

/** Résout la route courante et appelle le handler correspondant. */
export const resolve = () => {
  const hash = window.location.hash.slice(1) || '/';
  const [path, queryStr] = hash.split('?');
  const query = queryStr ? parseQuery(queryStr) : {};
  const container = document.getElementById('app');

  const matched = routes.find(({ regex }) => regex.test(path));

  if (matched) {
    const match = path.match(matched.regex);
    const params = Object.fromEntries(
      matched.paramNames.map((name, i) => [name, decodeURIComponent(match[i + 1])]),
    );
    matched.handler(container, params, query);
  } else if (notFoundHandler) {
    notFoundHandler(container);
  } else {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20">
        <h1 class="font-display text-6xl font-extrabold text-zinc-700">404</h1>
        <p class="text-zinc-500 mt-2">Page introuvable</p>
        <a href="#/" class="mt-4 px-5 py-2.5 rounded-xl bg-[#c8f04a] text-[#0a0a0f] font-display font-semibold text-sm">
          Retour à l'accueil
        </a>
      </div>`;
  }
};

/** Initialise le routeur. */
export const startRouter = () => {
  window.addEventListener('hashchange', resolve);
  resolve();
};
