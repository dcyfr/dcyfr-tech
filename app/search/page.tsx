'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import articlesData from '@/data/articles.json';
import type { Article } from '@/lib/types';
import { ArticleCard } from '@/components/ArticleCard';

const articles = articlesData as Article[];

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.content.toLowerCase().includes(q),
    ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [query]);

  return (
    <div>
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dcyfr-primary-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          autoFocus
          placeholder="Search articles, topics, tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 pl-10 pr-4 py-3 text-white placeholder-dcyfr-primary-400 focus:border-dcyfr-accent/60 focus:outline-none focus:ring-1 focus:ring-dcyfr-accent/40"
          aria-label="Search articles"
        />
      </div>

      {query.trim() === '' ? (
        <div className="rounded-xl border border-dcyfr-primary-800/40 bg-dcyfr-primary-900/40 p-10 text-center">
          <p className="text-dcyfr-primary-300">Enter a search term to find articles.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-dcyfr-primary-800/40 bg-dcyfr-primary-900/40 p-10 text-center">
          <p className="text-dcyfr-primary-300">No results for &quot;{query}&quot;.</p>
          <p className="text-xs text-dcyfr-primary-300 mt-2">Try a different keyword or browse by <a href="/articles" className="text-dcyfr-accent-300 hover:text-white transition-colors">category</a>.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-dcyfr-primary-300 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;</p>
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
        <p className="text-dcyfr-primary-300 mb-8">Search across all articles, categories, and tags.</p>
        <Suspense>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
