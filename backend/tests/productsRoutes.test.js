import { jest } from '@jest/globals';

// ── JWT_SECRET doit être défini AVANT l'import des modules ─────────
const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

// ── Mocks de la base de données ────────────────────────────────────

const mockDbRun = jest.fn();
const mockDbGet = jest.fn();
const mockDbAll = jest.fn();

jest.unstable_mockModule('../src/config/db.js', () => ({
  dbRun: mockDbRun,
  dbGet: mockDbGet,
  dbAll: mockDbAll,
  default: {},
}));

// ── Mock du filesystem (pour les images) ───────────────────────────

jest.unstable_mockModule('node:fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
}));

// ── Import dynamique APRÈS les mocks et env ────────────────────────

const { default: jwt } = await import('jsonwebtoken');
const { default: supertest } = await import('supertest');
const { createApp } = await import('../src/app.js');

const app = createApp();
const request = supertest(app);

// Helper : crée un token JWT + cookie CSRF valides
const authCookies = () => {
  const token = jwt.sign({ id: 1, email: 'test@test.com' }, JWT_SECRET, { expiresIn: '1h' });
  const csrfToken = 'test-csrf-token';
  return {
    cookieString: `token=${token}; csrf_token=${csrfToken}`,
    csrfToken,
  };
};

// ── Données de test ────────────────────────────────────────────────

const sampleProduct = {
  id: 1,
  label: 'Produit Test',
  description: 'Description test',
  price: 19.99,
  category: 'categorie1',
};

const sampleProductWithImages = {
  ...sampleProduct,
  images: [
    { id: 1, filename: 'img.jpg', path: '/uploads/img.jpg', mime_type: 'image/jpeg' },
  ],
};


describe('Products API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //  GET /api/products 

  describe('GET /api/products', () => {
    it('retourne 200 avec la liste des produits', async () => {
      mockDbAll.mockResolvedValue([
        { ...sampleProduct, image_paths: '/uploads/img.jpg' },
      ]);

      const res = await request.get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0].label).toBe('Produit Test');
      expect(res.body[0].image_paths).toEqual(['/uploads/img.jpg']);
    });

    it('retourne un tableau vide quand il n\'y a pas de produits', async () => {
      mockDbAll.mockResolvedValue([]);

      const res = await request.get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('est accessible sans authentification', async () => {
      mockDbAll.mockResolvedValue([]);

      const res = await request.get('/api/products');

      expect(res.status).toBe(200);
    });
  });

  // GET /api/products/:id

  describe('GET /api/products/:id', () => {
    it('retourne 200 avec le produit demandé', async () => {
      mockDbGet.mockResolvedValue(sampleProduct);
      mockDbAll.mockResolvedValue(sampleProductWithImages.images);

      const res = await request.get('/api/products/1');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
      expect(res.body.label).toBe('Produit Test');
      expect(res.body.images).toHaveLength(1);
    });

    it('retourne 404 si le produit n\'existe pas', async () => {
      mockDbGet.mockResolvedValue(undefined);

      const res = await request.get('/api/products/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Produit non trouvé');
    });

    it('est accessible sans authentification', async () => {
      mockDbGet.mockResolvedValue(sampleProduct);
      mockDbAll.mockResolvedValue([]);

      const res = await request.get('/api/products/1');

      expect(res.status).toBe(200);
    });
  });

  // POST /api/products 

  describe('POST /api/products', () => {
    it('retourne 201 avec le produit créé', async () => {
      const { cookieString, csrfToken } = authCookies();

      mockDbRun.mockResolvedValue({ lastID: 1, changes: 1 });
      mockDbGet.mockResolvedValue(sampleProduct);
      mockDbAll.mockResolvedValue([]);

      const res = await request
        .post('/api/products')
        .set('Cookie', cookieString)
        .set('x-csrf-token', csrfToken)
        .send({
          label: 'Produit Test',
          description: 'Description test',
          price: '19.99',
          category: 'categorie1',
        });

      expect(res.status).toBe(201);
      expect(res.body.label).toBe('Produit Test');
    });

    it('retourne 401 sans authentification', async () => {
      const res = await request
        .post('/api/products')
        .set('Cookie', 'csrf_token=abc')
        .set('x-csrf-token', 'abc')
        .send({
          label: 'Test',
          description: '',
          price: '10',
          category: 'cat1',
        });

      expect(res.status).toBe(401);
    });

    it('retourne 403 sans token CSRF', async () => {
      const token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: '1h' });

      const res = await request
        .post('/api/products')
        .set('Cookie', `token=${token}`)
        .send({
          label: 'Test',
          description: '',
          price: '10',
          category: 'cat1',
        });

      expect(res.status).toBe(403);
    });
  });

  // PUT /api/products/:id 

  describe('PUT /api/products/:id', () => {
    it('retourne 200 avec le produit mis à jour', async () => {
      const { cookieString, csrfToken } = authCookies();

      const updatedProduct = { ...sampleProduct, label: 'Modifié' };
      mockDbGet
        .mockResolvedValueOnce(sampleProduct)
        .mockResolvedValueOnce(updatedProduct);
      mockDbRun.mockResolvedValue({ changes: 1 });
      mockDbAll.mockResolvedValue([]);

      const res = await request
        .put('/api/products/1')
        .set('Cookie', cookieString)
        .set('x-csrf-token', csrfToken)
        .send({
          label: 'Modifié',
          description: 'Nouvelle desc',
          price: '25',
          category: 'categorie1',
        });

      expect(res.status).toBe(200);
      expect(res.body.label).toBe('Modifié');
    });

    it('retourne 404 si le produit n\'existe pas', async () => {
      const { cookieString, csrfToken } = authCookies();
      mockDbGet.mockResolvedValue(undefined);

      const res = await request
        .put('/api/products/999')
        .set('Cookie', cookieString)
        .set('x-csrf-token', csrfToken)
        .send({
          label: 'X',
          description: '',
          price: '10',
          category: 'cat1',
        });

      expect(res.status).toBe(404);
    });

    it('retourne 401 sans authentification', async () => {
      const res = await request
        .put('/api/products/1')
        .set('Cookie', 'csrf_token=abc')
        .set('x-csrf-token', 'abc')
        .send({ label: 'X', description: '', price: '10', category: 'cat1' });

      expect(res.status).toBe(401);
    });
  });

  // DELETE /api/products/:id

  describe('DELETE /api/products/:id', () => {
    it('retourne 204 après suppression', async () => {
      const { cookieString, csrfToken } = authCookies();

      mockDbGet.mockResolvedValue(sampleProduct);
      mockDbAll.mockResolvedValue([]);
      mockDbRun.mockResolvedValue({ changes: 1 });

      const res = await request
        .delete('/api/products/1')
        .set('Cookie', cookieString)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(204);
    });

    it('retourne 404 si le produit n\'existe pas', async () => {
      const { cookieString, csrfToken } = authCookies();
      mockDbGet.mockResolvedValue(undefined);

      const res = await request
        .delete('/api/products/999')
        .set('Cookie', cookieString)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(404);
    });

    it('retourne 401 sans authentification', async () => {
      const res = await request
        .delete('/api/products/1')
        .set('Cookie', 'csrf_token=abc')
        .set('x-csrf-token', 'abc');

      expect(res.status).toBe(401);
    });

    it('retourne 403 sans token CSRF', async () => {
      const token = jwt.sign({ id: 1 }, JWT_SECRET, { expiresIn: '1h' });

      const res = await request
        .delete('/api/products/1')
        .set('Cookie', `token=${token}`);

      expect(res.status).toBe(403);
    });
  });
});
