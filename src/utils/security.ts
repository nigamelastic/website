/**
 * Sanitizes a URL to ensure it's safe to use in an `href` attribute.
 *
 * @param url The URL to sanitize.
 * @returns The sanitized URL, or '#' if the URL is invalid or unsafe.
 */
export function sanitizeUrl(url: string): string {
  if (!url) {
    return '#';
  }

  // Allow relative URLs that start with /
  if (url.startsWith('/')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch (error) {
    // URL parsing failed, treat as unsafe
  }

  return '#';
}
