import { dbAll } from '../config/db.js';

export const getCategoryCounts = () =>
  dbAll(`
    SELECT category AS nom, COUNT(*) AS compte
    FROM products
    GROUP BY category
    ORDER BY compte DESC
  `);
