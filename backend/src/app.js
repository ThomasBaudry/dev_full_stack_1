import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { authRoutes } from './routes/authRoutes.js';
import { productsRoutes } from './routes/productsRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createApp = () => {
  const app = express();

  // Taille des images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Dossier Images
  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/stats', statsRoutes);

  app.use(errorHandler);

  return app;
};
