import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../repositories/usersRepository.js";

const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    const err = new Error(
      "Le mot de passe doit contenir au moins 8 caractères",
    );
    err.status = 400;
    throw err;
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    const err = new Error("Email invalide");
    err.status = 400;
    throw err;
  }
};

export const registerUser = async ({ email, password }) => {
  validatePassword(password);
  validateEmail(email);

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    const err = new Error("Cet email est déjà utilisé");
    err.status = 400;
    throw err;
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const result = await createUser({ email, password: hash });

  return { id: result.lastID, email };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("Identifiants invalides");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Identifiants invalides");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, email: user.email },
  };
};
