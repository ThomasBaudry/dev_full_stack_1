import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { authRoutes } from './routes/authRoutes.js';
import { productsRoutes } from './routes/productsRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requireCsrf } from './middlewares/csrf.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createApp = () => {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

  app.use(
    cors({
      origin: frontendOrigin,
      credentials: true,
    })
  );
  app.options('*', cors({ origin: frontendOrigin, credentials: true }));

  // Taille des images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Dossier Images
  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  // Endpoint CSRF consommé par le frontend (/api/csrf-token)
  app.get('/api/csrf-token', (req, res) => {
    const csrfToken = randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 60 minutes
    });
    res.json({ csrfToken });
  });

  // Protection CSRF globale sur les routes API mutantes (POST/PUT/DELETE...)
  app.use('/api', requireCsrf);

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/stats', statsRoutes);

  app.use(errorHandler);

  return app;
};
