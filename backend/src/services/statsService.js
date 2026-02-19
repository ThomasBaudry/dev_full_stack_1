import { getCategoryCounts } from '../repositories/categoriesRepository.js';

export const getStats = () => getCategoryCounts();
