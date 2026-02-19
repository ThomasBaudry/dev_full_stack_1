import { Router } from 'express';
import { index } from '../controllers/statsController.js';
import { openCors } from '../config/cors.js';

export const statsRoutes = Router();

// CORS ouvert pour cette route (accessible depuis toutes les IP)
statsRoutes.get('/', openCors, index);
