## 2025-05-15 - Unsanitized RSS Feed Links
**Vulnerability:** External RSS feeds were rendered directly without sanitization, specifically `item.link`.
**Learning:** `rss-parser` does not sanitize links (e.g., `javascript:`) by default.
**Prevention:** Always sanitize URLs from external sources, even if they seem trusted. Implemented `sanitizeUrl` utility to enforce `http/https` protocols.
