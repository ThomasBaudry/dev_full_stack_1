import { dbRun, dbGet } from '../config/db.js';

export const findUserByEmail = (email) =>
  dbGet('SELECT * FROM users WHERE email = ?', [email]);

export const findUserByUsername = (username) =>
  dbGet('SELECT * FROM users WHERE username = ?', [username]);

export const findUserById = (id) =>
  dbGet('SELECT id, username, email FROM users WHERE id = ?', [id]);

export const createUser = ({ username, email, password }) =>
  dbRun(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
