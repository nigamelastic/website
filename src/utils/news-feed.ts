import Parser from 'rss-parser';
import { FEEDS } from '../data/news-feeds';

export type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  source: string;
  isoDate?: string;
};

export async function fetchNewsFeeds(feeds = FEEDS, parser = new Parser()): Promise<NewsItem[]> {
  try {
    const feedPromises = feeds.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return parsed.items.map((item) => ({
          title: item.title || 'No Title',
          link: item.link || '#',
          pubDate: item.pubDate || '',
          contentSnippet: item.contentSnippet || '',
          source: feed.name,
          isoDate: item.isoDate,
        }));
      } catch (error) {
        console.error(`Error fetching feed ${feed.name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    const flattenedResults = results.flat() as NewsItem[];

    // Sort by date (newest first)
    const sortedNews = flattenedResults.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate || 0);
      const dateB = new Date(b.isoDate || b.pubDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Limit to latest 30 items
    return sortedNews.slice(0, 30);
  } catch (error) {
    console.error('Failed to fetch news feeds:', error);
    return [];
  }
}
