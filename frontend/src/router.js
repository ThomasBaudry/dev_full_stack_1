/**
 * Routeur hash-based minimal.
 * Chaque route est associée à une fonction render(container, params, query).
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
  routes.push({
    regex: new RegExp(`^${regexStr}$`),
    paramNames,
    handler,
  });
};

/** Enregistre le handler 404. */
export const setNotFound = (handler) => {
  notFoundHandler = handler;
};

/** Parse la query string d'un hash (ex: ?q=foo&page=2). */
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

  const matched = routes.find(({ regex }) => regex.test(path));
  const container = document.getElementById('app');

  if (matched) {
    const match = path.match(matched.regex);
    const params = Object.fromEntries(
      matched.paramNames.map((name, i) => [name, decodeURIComponent(match[i + 1])]),
    );
    matched.handler(container, params, query);
  } else if (notFoundHandler) {
    notFoundHandler(container);
  } else {
    container.innerHTML = '<h2>Page introuvable</h2>';
  }
};

/** Initialise le routeur (écoute les changements de hash). */
export const startRouter = () => {
  window.addEventListener('hashchange', resolve);
  resolve();
};
