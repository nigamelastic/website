import { describe, it, expect } from 'bun:test';
import { sanitizeUrl } from './security';

describe('sanitizeUrl', () => {
  it('should allow valid http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('should allow valid https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should allow valid relative URLs', () => {
    expect(sanitizeUrl('/some/path')).toBe('/some/path');
  });

  it('should sanitize javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
  });

  it('should sanitize vbscript: URLs', () => {
    expect(sanitizeUrl('vbscript:msgbox "hello"')).toBe('#');
  });

  it('should sanitize data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
  });

  it('should sanitize malformed URLs', () => {
    expect(sanitizeUrl('not a url')).toBe('#');
  });

  it('should sanitize empty URLs', () => {
    expect(sanitizeUrl('')).toBe('#');
  });

  it('should handle missing protocol by defaulting to # (or invalid)', () => {
     // "example.com" without protocol is treated as relative by new URL("example.com")?
     // No, new URL("example.com") throws TypeError.
     // So it should return '#'.
     expect(sanitizeUrl('example.com')).toBe('#');
  });
});
