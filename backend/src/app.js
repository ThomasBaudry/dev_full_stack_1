import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { authRoutes } from './routes/authRoutes.js';
import { productsRoutes } from './routes/productsRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';
import { cspApiRoutes, cspReceiverRoutes } from './routes/cspRoutes.js';
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

  app.use(
    express.json({
      limit: '50mb',
      type: ['application/json', 'application/csp-report', 'application/reports+json'],
    })
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  // Add Content-Security-Policy header to protect from XSS and report violations.
  app.use((req, res, next) => {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' https://cdn.tailwindcss.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data:",
      "report-uri /csp-report"
    ];
    res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
    next();
  });

  app.get('/api/csrf-token', (_req, res) => {
    const csrfToken = randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });
    res.json({ csrfToken });
  });

  // Public endpoint used by browser CSP reporting.
  app.use('/csp-report', cspReceiverRoutes);

  // CSRF protection for mutating /api requests.
  app.use('/api', requireCsrf);

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/csp', cspApiRoutes);

  app.use(errorHandler);

  return app;
};
