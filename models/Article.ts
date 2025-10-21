import { Category, categoryFromJson } from './Category';
import { Source, sourceFromJson } from './Source';

export interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  sourceId: number;
  publishedAt: Date;
  scrapedAt: Date;

  // Related entities
  source?: Source;
  categories?: Category[];

  // Additional fields for UI
  imageUrl?: string;
  excerpt?: string;
  author?: string;
}

export function articleFromJson(json: any): Article {
  return {
    id: json.id,
    title: json.title,
    content: json.content,
    url: json.url,
    sourceId: json.source_id,
    publishedAt: new Date(json.published_at),
    scrapedAt: new Date(json.scraped_at),
    source: json.source ? sourceFromJson(json.source) : undefined,
    categories: json.categories?.map((cat: any) => categoryFromJson(cat)),
    imageUrl: json.image_url,
    excerpt: json.excerpt,
    author: json.author,
  };
}

export function articleToJson(article: Article): any {
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    url: article.url,
    source_id: article.sourceId,
    published_at: article.publishedAt.toISOString(),
    scraped_at: article.scrapedAt.toISOString(),
    source: article.source,
    categories: article.categories,
    image_url: article.imageUrl,
    excerpt: article.excerpt,
    author: article.author,
  };
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 7) {
    return `${Math.floor(diffDays / 7)}w ago`;
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ago`;
  } else {
    return 'Just now';
  }
}
