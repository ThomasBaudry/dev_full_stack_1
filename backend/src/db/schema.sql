PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  email     TEXT    NOT NULL UNIQUE,
  password  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  label       TEXT    NOT NULL,
  description TEXT,
  price       REAL    NOT NULL CHECK(price >= 0),
  category    TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  filename   TEXT    NOT NULL,
  path       TEXT    NOT NULL,
  mime_type  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS csp_reports (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  document_uri       TEXT,
  violated_directive TEXT,
  effective_directive TEXT,
  blocked_uri        TEXT,
  source_file        TEXT,
  line_number        INTEGER,
  column_number      INTEGER,
  original_policy    TEXT,
  disposition        TEXT,
  status_code        INTEGER,
  referrer           TEXT,
  script_sample      TEXT,
  user_agent         TEXT,
  raw_report         TEXT,
  created_at         DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_csp_reports_created_at ON csp_reports(created_at DESC);
