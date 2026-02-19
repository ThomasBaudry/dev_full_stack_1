import { Router } from 'express';
import { index, show, create, update, destroy } from '../controllers/productsController.js';
import { requireAuth } from '../middlewares/auth.js';

export const productsRoutes = Router();

// Routes publiques
productsRoutes.get('/', index);
productsRoutes.get('/:id', show);

// Routes protégées
productsRoutes.post('/', requireAuth, create);
productsRoutes.put('/:id', requireAuth, update);
productsRoutes.delete('/:id', requireAuth, destroy);
