# Frontend — Pages publiques (Personne 2)

## Installation

```bash
cd frontend
npm install
npm run dev
```

Le serveur de développement démarre sur **http://localhost:3000**.

Pour un build de production :

```bash
npm run build
npm run preview
```

## Prérequis

- Node.js >= 18
- Le backend (Personne 1) doit tourner sur **http://localhost:5000**

## Architecture du projet

```
frontend/
├── index.html                  # Shell HTML principal (SPA)
├── package.json                # Dépendances : Vite + Bootstrap 5
├── vite.config.js              # Vite configuré sur le port 3000
└── src/
    ├── main.js                 # Point d'entrée, enregistrement des routes
    ├── router.js               # Routeur hash-based maison
    ├── api.js                  # Fonctions d'appels au backend (fetch)
    ├── auth.js                 # Gestion JWT localStorage + validation NIST
    ├── cart.js                 # Panier côté client (localStorage)
    ├── csrf.js                 # Récupération et cache du token CSRF
    ├── utils.js                # Échappement XSS, formatage, helpers DOM
    ├── components/
    │   ├── navbar.js           # Barre de navigation (recherche, panier, auth)
    │   └── footer.js           # Pied de page
    ├── pages/
    │   ├── home.js             # Accueil — grille de tous les produits
    │   ├── product.js          # Détail d'un produit (carousel, panier)
    │   ├── search.js           # Résultats de recherche
    │   ├── login.js            # Formulaire de connexion
    │   ├── register.js         # Formulaire d'inscription
    │   ├── cartPage.js         # Page panier complète
    │   ├── stats.js            # Statistiques (graphique + tableau)
    │   └── dashboard.js        # Dashboard connecté (protégé)
    └── styles/
        └── main.css            # Styles personnalisés
```

## Routes disponibles

| Hash                | Page                        | Accès       |
|---------------------|-----------------------------|-------------|
| `#/`                | Accueil (liste produits)    | Public      |
| `#/product/:id`     | Détail d'un produit         | Public      |
| `#/search?q=...`    | Résultats de recherche      | Public      |
| `#/login`           | Connexion                   | Public      |
| `#/register`        | Inscription                 | Public      |
| `#/cart`            | Panier                      | Public      |
| `#/stats`           | Statistiques par catégorie  | Public      |
| `#/dashboard`       | Dashboard                   | Connecté    |

---

## Validation des attendus du projet

### Fonctionnalités visiteur

| Attendu | Implémentation | Fichier(s) |
|---------|----------------|------------|
| **Afficher tous les produits** | Page d'accueil avec grille de cartes Bootstrap, chargement asynchrone via `fetchProducts()` | `pages/home.js` |
| **Afficher un seul produit** | Page détail avec carousel d'images Bootstrap, breadcrumb, prix, description, catégorie | `pages/product.js` |
| **Rechercher des produits** | Barre de recherche intégrée à la navbar, page de résultats dédiée via `searchProducts()` | `components/navbar.js`, `pages/search.js` |
| **Ajouter un produit au panier** | Bouton sur chaque carte et sur la page détail, feedback visuel « Ajouté ! » | `pages/home.js`, `pages/product.js`, `cart.js` |
| **Accéder à l'URL de statistiques** | Page avec graphique en barres CSS et tableau détaillé, fetch de `/api/stats` | `pages/stats.js` |
| **Se connecter** | Formulaire avec email/mot de passe, toggle affichage mot de passe, gestion JWT | `pages/login.js` |
| **S'inscrire** | Formulaire avec validation NIST en temps réel, confirmation de mot de passe | `pages/register.js` |

### Fonctionnalités connecté

| Attendu | Implémentation | Fichier(s) |
|---------|----------------|------------|
| **Dashboard** | Page protégée, redirection vers login si non connecté | `pages/dashboard.js` |
| **Se déconnecter** | Bouton dans la navbar, suppression JWT + token CSRF, appel API logout | `components/navbar.js` |

### Contraintes techniques

| Contrainte | Comment c'est respecté |
|------------|----------------------|
| **Front sur localhost:3000** | `vite.config.js` → `server.port: 3000` avec `strictPort: true` |
| **Back sur localhost:5000** | Toutes les requêtes dans `api.js` pointent vers `http://localhost:5000/api` |
| **Pas de React/Vue/Angular** | 100% Vanilla JavaScript (ES Modules) |
| **Bootstrap autorisé** | Bootstrap 5.3 installé via npm, importé dans `main.js` |
| **Bundler (bonus)** | Vite 5 configuré, build de production fonctionnel |
| **Prévalence du frontend** | Toute la logique d'affichage, le routage, le panier et la validation sont côté front |

### Programmation fonctionnelle

| Principe | Application |
|----------|-------------|
| **Peu de `let`/`var`** | Utilisation exclusive de `const` dans tout le code |
| **Fonctions pures** | `escapeHtml`, `formatPrice`, `truncate`, `validatePassword`, `parseQuery` — aucun effet de bord |
| **Expressions lambda** | Arrow functions (`=>`) partout |
| **Asynchrone** | `async`/`await` pour tous les appels API, `Promise` pour le CSRF |
| **Méthodes fonctionnelles** | `map`, `filter`, `reduce`, `find`, `forEach` pour toutes les transformations de données |
| **Immutabilité** | Le panier est reconstruit par spread (`...`) à chaque modification, jamais muté |

### Sécurité

| Mesure | Implémentation |
|--------|----------------|
| **Protection XSS** | Fonction `escapeHtml()` appliquée sur **toutes** les données dynamiques affichées dans le DOM (`&`, `<`, `>`, `"`, `'`) |
| **Token CSRF** | Module `csrf.js` récupère le token du backend, l'inclut dans les headers (`X-CSRF-Token`) et en champ caché dans les formulaires |
| **Validation mot de passe NIST SP 800-63B** | Minimum 8 caractères, maximum 64, vérification contre une liste de mots de passe courants, rejet des caractères répétés, feedback en temps réel |
| **Pas d'injection dans les URL** | `encodeURIComponent()` sur tous les paramètres d'URL (recherche, IDs produit) |
| **Credentials sécurisés** | `credentials: 'include'` sur toutes les requêtes fetch pour gérer les cookies de session |
| **Toggle mot de passe** | Bouton « Afficher/Masquer » sur les champs mot de passe (bonne pratique NIST, permet le copier-coller) |
| **Vérification d'identité** | Le dashboard redirige vers `/login` si l'utilisateur n'est pas authentifié |

### Panier côté client

- Stockage dans `localStorage` sous la clé `cart`
- Ajout, suppression, modification de quantité (+/-)
- Calcul du total en temps réel
- Badge de compteur dans la navbar, mis à jour via `CustomEvent`
- Bouton « Vider le panier » avec confirmation
- Persistance entre les sessions navigateur

### Routing SPA

- Routeur hash-based maison (`router.js`) sans dépendance externe
- Support des paramètres dynamiques (`:id` dans `/product/:id`)
- Support des query strings (`?q=...` pour la recherche)
- Page 404 personnalisée pour les routes inconnues
- Re-rendu de la navbar à chaque changement de route (état auth/panier à jour)
