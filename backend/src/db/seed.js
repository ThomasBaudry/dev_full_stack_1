import 'dotenv/config';
import sqlite3 from 'sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../data/app.db');

const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    })
  );

const exec = (sql) =>
  new Promise((resolve, reject) =>
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    })
  );

const seed = async () => {
  try {
    // Activer les foreign keys
    await run('PRAGMA foreign_keys = ON');

    // Exécuter le schéma
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    await exec(schema);
    console.log('Schema créé avec succès');

    // Créer l'utilisateur admin avec mot de passe hashé
    const hash = await bcrypt.hash('admin123', 12);
    await run(
      'INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)',
      ['admin', 'admin@boutique.fr', hash]
    );
    console.log('Utilisateur admin créé');

    // Exécuter le seed SQL (produits)
    const seedSql = readFileSync(join(__dirname, 'seed.sql'), 'utf8');
    await exec(seedSql);
    console.log('Produits seed insérés');

    console.log('Seed terminé avec succès !');
  } catch (err) {
    console.error('Erreur lors du seed:', err);
  } finally {
    db.close();
  }
};

seed();
