## 2025-05-24 - [CISA RSS Feed Bloat]
**Learning:** External RSS feeds (CISA) can contain massive, unformatted HTML payloads (~100kb/item) that slow down rendering and increase build times significantly if rendered directly.
**Action:** Always implement server-side truncation and sanitization for external content before passing it to frontend components.
