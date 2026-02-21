import { describe, it, expect, mock } from 'bun:test';
import { fetchNewsFeeds, type NewsItem } from './news-feed';
import type Parser from 'rss-parser';

// Mock data
const mockFeed1 = { name: 'Feed 1', url: 'http://feed1.com/rss' };
const mockFeed2 = { name: 'Feed 2', url: 'http://feed2.com/rss' };
const testFeeds = [mockFeed1, mockFeed2];

const mockItem1 = {
  title: 'Item 1',
  link: 'http://item1.com',
  pubDate: '2023-01-02T10:00:00Z',
  contentSnippet: 'Snippet 1',
  isoDate: '2023-01-02T10:00:00Z',
};

const mockItem2 = {
  title: 'Item 2',
  link: 'http://item2.com',
  pubDate: '2023-01-01T10:00:00Z',
  contentSnippet: 'Snippet 2',
  isoDate: '2023-01-01T10:00:00Z',
};

// Helper to create a mock parser
const createMockParser = (responses: Record<string, any>) => {
  return {
    parseURL: mock((url: string) => {
      if (responses[url]) {
        if (responses[url] instanceof Error) {
          return Promise.reject(responses[url]);
        }
        return Promise.resolve(responses[url]);
      }
      return Promise.reject(new Error(`Unknown URL: ${url}`));
    }),
  } as unknown as Parser;
};

describe('fetchNewsFeeds', () => {
  it('should fetch and sort news items from multiple feeds', async () => {
    const parser = createMockParser({
      [mockFeed1.url]: { items: [mockItem1] },
      [mockFeed2.url]: { items: [mockItem2] },
    });

    const news = await fetchNewsFeeds(testFeeds, parser);

    expect(news).toHaveLength(2);
    expect(news[0].title).toBe('Item 1'); // Newer first
    expect(news[1].title).toBe('Item 2');
    expect(news[0].source).toBe('Feed 1');
    expect(news[1].source).toBe('Feed 2');
  });

  it('should handle partial feed failures', async () => {
    const parser = createMockParser({
      [mockFeed1.url]: { items: [mockItem1] },
      [mockFeed2.url]: new Error('Network error'),
    });

    const news = await fetchNewsFeeds(testFeeds, parser);

    expect(news).toHaveLength(1);
    expect(news[0].title).toBe('Item 1');
  });

  it('should handle all feeds failing', async () => {
    const parser = createMockParser({
      [mockFeed1.url]: new Error('Error 1'),
      [mockFeed2.url]: new Error('Error 2'),
    });

    const news = await fetchNewsFeeds(testFeeds, parser);

    expect(news).toHaveLength(0);
  });

  it('should handle empty feed list', async () => {
    const parser = createMockParser({});
    const news = await fetchNewsFeeds([], parser);
    expect(news).toHaveLength(0);
  });

  it('should limit items to 30', async () => {
    // Generate 40 items
    const items = Array.from({ length: 40 }, (_, i) => ({
      title: `Item ${i}`,
      link: `http://item${i}.com`,
      pubDate: new Date(Date.now() - i * 1000).toISOString(),
      contentSnippet: `Snippet ${i}`,
      isoDate: new Date(Date.now() - i * 1000).toISOString(),
    }));

    const parser = createMockParser({
      [mockFeed1.url]: { items },
    });

    const news = await fetchNewsFeeds([mockFeed1], parser);

    expect(news).toHaveLength(30);
    expect(news[0].title).toBe('Item 0'); // Newest
  });

  it('should handle missing fields with defaults', async () => {
    const incompleteItem = {
      // Missing title, link, pubDate, contentSnippet
    };

    const parser = createMockParser({
      [mockFeed1.url]: { items: [incompleteItem] },
    });

    const news = await fetchNewsFeeds([mockFeed1], parser);

    expect(news).toHaveLength(1);
    expect(news[0].title).toBe('No Title');
    expect(news[0].link).toBe('#');
    expect(news[0].contentSnippet).toBe('');
  });
});
