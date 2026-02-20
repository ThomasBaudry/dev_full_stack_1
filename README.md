***Dev Full Stack 1***

Application full-stack d'ecommerce (backend Node/Express + frontend Vite) utilisée pour le projet du cours "Dev Full Stack 1".

**Groupe:**
Claire Simonot,
Benjamin Seixeiro,
Thomas Baudry

**Stack principale**
- Backend: Node.js, Express
- Frontend: Vanilla JS + Vite
- Tests: Jest (backend)

**Fonctionnalités**
- Gestion des produits (API CRUD)
- Authentification (register / login / logout)
- Rapports CSP
- URL Statistiques
- Uploads de fichiers
- Dashboard

**Prérequis**
- Node.js 18+ et npm
- (Optionnel) une base de données compatible SQL si vous souhaitez persister les données en dehors des seeds fournis

Installation et exécution

1. Cloner le dépôt

```
git clone <repo-url>
cd dev_full_stack_1
```

2. Backend

```
cd backend
npm install
```

Créer un fichier `.env` dans `backend/` si nécessaire. Exemple minimal :

```
PORT=3000
DATABASE_URL=sqlite://./data/dev.db   # ou vos variables DB (host,user,password,name)
JWT_SECRET=change_me
```

Lancer le serveur backend en développement :

```
npm run dev
```

3. Frontend

```
cd ../frontend
npm install
npm run dev
```

Puis ouvrir l'URL indiquée par Vite (par défaut `http://localhost:5173`).

Tests

Les tests backend utilisent Jest. Pour exécuter les tests :

```
cd backend
npm test
```

**Structure du projet (raccourci)**
- `backend/` : code serveur, routes, controllers, services, repositories, tests
- `frontend/` : application côté client (Vite)
- `uploads/` : fichiers uploadés


**Endpoints**
Base URL : http://localhost:3000  (changer si `PORT` différent)

- `POST /api/auth/register` — enregistrement — http://localhost:3000/api/auth/register
- `POST /api/auth/login` — connexion — http://localhost:3000/api/auth/login
- `GET /api/products` — liste des produits — http://localhost:3000/api/products
- `GET /api/products/:id` — détail d'un produit — http://localhost:3000/api/products/:id
- `POST /api/products` — créer un produit (auth requis) — http://localhost:3000/api/products
- `PUT /api/products/:id` — modifier un produit (auth requis) — http://localhost:3000/api/products/:id
- `DELETE /api/products/:id` — supprimer un produit (auth requis) — http://localhost:3000/api/products/:id
- `GET /api/stats` — statistiques — http://localhost:3000/api/stats
- `POST /api/csp-reports` — envoi d'un rapport CSP — http://localhost:3000/api/csp-reports
