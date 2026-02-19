import * as cspReportsService from '../services/cspReportsService.js';

export const collect = async (req, res, next) => {
  try {
    await cspReportsService.ingestCspReports(req.body, req.get('user-agent'));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const index = async (_req, res, next) => {
  try {
    const reports = await cspReportsService.listLatestCspReports();
    res.json(reports);
  } catch (err) {
    next(err);
  }
};
