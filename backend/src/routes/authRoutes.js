import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';

export const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', requireAuth, logout);
