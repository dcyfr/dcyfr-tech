import type { MetadataRoute } from 'next';
import articles from '@/data/articles.json';
import whitepapers from '@/data/whitepapers.json';
import type { Article, Whitepaper } from '@/lib/types';

const BASE = 'https://dcyfr.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/whitepapers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = (articles as Article[]).map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly',
    priority: a.featured ? 0.9 : 0.8,
  }));

  const whitepaperRoutes: MetadataRoute.Sitemap = (whitepapers as Whitepaper[]).map((wp) => ({
    url: `${BASE}/whitepapers/${wp.slug}`,
    lastModified: new Date(wp.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...whitepaperRoutes];
}
