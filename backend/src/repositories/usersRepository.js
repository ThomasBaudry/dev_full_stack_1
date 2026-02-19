import { dbRun, dbGet } from "../config/db.js";

export const findUserByEmail = (email) =>
  dbGet("SELECT * FROM users WHERE email = ?", [email]);

export const createUser = ({ email, password }) =>
  dbRun("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);
