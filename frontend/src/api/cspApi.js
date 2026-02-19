import { get } from './http.js';

export const fetchCspReports = () => get('/csp/reports');
