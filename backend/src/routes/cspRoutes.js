import { Router } from 'express';
import { collect, index } from '../controllers/cspReportsController.js';
import { requireAuth } from '../middlewares/auth.js';

export const cspReceiverRoutes = Router();
export const cspApiRoutes = Router();

// Endpoint de collecte CSP (public, pour report-uri / report-to).
cspReceiverRoutes.post('/', collect);

// Consultation des rapports CSP (protégé).
cspApiRoutes.get('/reports', requireAuth, index);
