export type ArticleCategory =
  | 'Agent Patterns'
  | 'Context Engineering'
  | 'RAG'
  | 'Code Generation'
  | 'Infrastructure'
  | 'Security'
  | 'Workspace'
  | 'Releases';

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string; // ISO 8601
  readingTime: number; // minutes
  category: ArticleCategory;
  tags: string[];
  content: string; // markdown
  featured: boolean;
  sourceFile?: string; // nexus path
}

export interface Whitepaper {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  author: string;
  publishedAt: string;
  downloadUrl: string;
  category: ArticleCategory;
  tags: string[];
  pages?: number;
}

export interface RssFeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}
