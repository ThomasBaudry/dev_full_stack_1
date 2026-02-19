import { dbAll, dbRun } from '../config/db.js';

export const createCspReport = (report) =>
  dbRun(
    `INSERT INTO csp_reports (
      document_uri,
      violated_directive,
      effective_directive,
      blocked_uri,
      source_file,
      line_number,
      column_number,
      original_policy,
      disposition,
      status_code,
      referrer,
      script_sample,
      user_agent,
      raw_report
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      report.document_uri ?? null,
      report.violated_directive ?? null,
      report.effective_directive ?? null,
      report.blocked_uri ?? null,
      report.source_file ?? null,
      report.line_number ?? null,
      report.column_number ?? null,
      report.original_policy ?? null,
      report.disposition ?? null,
      report.status_code ?? null,
      report.referrer ?? null,
      report.script_sample ?? null,
      report.user_agent ?? null,
      report.raw_report ?? null,
    ]
  );

export const getLatestCspReports = (limit = 50) =>
  dbAll(
    `SELECT
      id,
      document_uri,
      violated_directive,
      effective_directive,
      blocked_uri,
      source_file,
      line_number,
      column_number,
      original_policy,
      disposition,
      status_code,
      referrer,
      script_sample,
      user_agent,
      created_at
    FROM csp_reports
    ORDER BY datetime(created_at) DESC, id DESC
    LIMIT ?`,
    [limit]
  );
