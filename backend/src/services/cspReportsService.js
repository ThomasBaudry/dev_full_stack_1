import * as cspReportsRepo from '../repositories/cspReportsRepository.js';

const MAX_TEXT = 2000;
const MAX_RAW_REPORT = 8000;

const truncate = (value, max = MAX_TEXT) => {
  if (value === undefined || value === null) return null;
  return String(value).slice(0, max);
};

const toNullableInt = (value) => {
  const num = Number(value);
  return Number.isInteger(num) ? num : null;
};

const toStorageShape = (report, userAgent) => ({
  document_uri: truncate(report['document-uri'] ?? report.documentURI),
  violated_directive: truncate(report['violated-directive'] ?? report.violatedDirective),
  effective_directive: truncate(report['effective-directive'] ?? report.effectiveDirective),
  blocked_uri: truncate(report['blocked-uri'] ?? report.blockedURI),
  source_file: truncate(report['source-file'] ?? report.sourceFile),
  line_number: toNullableInt(report['line-number'] ?? report.lineNumber),
  column_number: toNullableInt(report['column-number'] ?? report.columnNumber),
  original_policy: truncate(report['original-policy'] ?? report.originalPolicy),
  disposition: truncate(report.disposition),
  status_code: toNullableInt(report['status-code'] ?? report.statusCode),
  referrer: truncate(report.referrer),
  script_sample: truncate(report['script-sample'] ?? report.scriptSample),
  user_agent: truncate(userAgent),
  raw_report: truncate(JSON.stringify(report), MAX_RAW_REPORT),
});

const extractReports = (payload) => {
  if (!payload || typeof payload !== 'object') return [];

  if (Array.isArray(payload)) {
    // format Reporting API (application/reports+json)
    return payload
      .map((item) => item?.body)
      .filter((body) => body && typeof body === 'object');
  }

  if (payload['csp-report'] && typeof payload['csp-report'] === 'object') {
    return [payload['csp-report']];
  }

  if (payload.body && typeof payload.body === 'object') {
    return [payload.body];
  }

  return [payload];
};

export const ingestCspReports = async (payload, userAgent) => {
  const reports = extractReports(payload);
  if (reports.length === 0) return 0;

  for (const report of reports) {
    await cspReportsRepo.createCspReport(toStorageShape(report, userAgent));
  }

  return reports.length;
};

export const listLatestCspReports = async () => cspReportsRepo.getLatestCspReports(100);
