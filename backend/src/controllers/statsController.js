import { getStats } from '../services/statsService.js';

export const index = async (_req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
