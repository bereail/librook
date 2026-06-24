-- Ejecutar en el VPS: psql $DATABASE_URL -f schema_analytics.sql

CREATE TABLE IF NOT EXISTS page_views (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT        NOT NULL,
  user_email  TEXT,
  path        TEXT        NOT NULL,
  referrer    TEXT,
  device_type TEXT,
  browser     TEXT,
  os          TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pv_created   ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_session   ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_pv_path      ON page_views(path);
