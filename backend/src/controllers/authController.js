import { registerUser, loginUser } from '../services/authService.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
};

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'Utilisateur créé', user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);
    res.cookie('token', token, COOKIE_OPTIONS).json({ message: 'Connecté', user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req, res) => {
  res.clearCookie('token').json({ message: 'Déconnecté' });
};
