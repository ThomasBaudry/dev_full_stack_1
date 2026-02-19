import sqlite3 from 'sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../data/app.db');

const db = new sqlite3.Database(DB_PATH);

// Activer les foreign keys
db.run('PRAGMA foreign_keys = ON');

// Exécuter le schéma au démarrage (idempotent grâce à IF NOT EXISTS)
const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf8');
db.exec(schema, (err) => {
  if (err) console.error('Erreur schema:', err);
});

// Helpers async (promisification de sqlite3)
export const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    })
  );

export const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    })
  );

export const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    })
  );

export default db;
