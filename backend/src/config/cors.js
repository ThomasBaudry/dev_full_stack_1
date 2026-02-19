import cors from 'cors';

// CORS ouvert pour certaines routes publiques (ex: /api/stats)
export const openCors = cors({
  origin: true,
  credentials: true,
});

