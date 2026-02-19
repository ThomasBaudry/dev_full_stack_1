import { dbAll } from '../config/db.js';

export const getCategoryCounts = () =>
  dbAll(`
    SELECT category AS nom, COUNT(*) AS stock
    FROM products
    GROUP BY category
    ORDER BY stock DESC
  `);
