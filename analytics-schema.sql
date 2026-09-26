CREATE TABLE IF NOT EXISTS events (
  day TEXT NOT NULL,
  paper_key TEXT NOT NULL,
  title TEXT NOT NULL,
  doi TEXT NOT NULL,
  cluster TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('publisher_click','open_fulltext_click','pdf_click','request_click')),
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day,paper_key,action)
);
CREATE TABLE IF NOT EXISTS visits (
  day TEXT PRIMARY KEY,
  pageviews INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS visitor_days (
  day TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  PRIMARY KEY(day,visitor_hash)
);
