import type { Article } from '@/lib/types';
import { clsx } from 'clsx';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'compact' | 'full';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleCard({ article, variant = 'full' }: Readonly<ArticleCardProps>) {
  if (variant === 'compact') {
    return (
      <a
        href={`/articles/${article.slug}`}
        className="group flex items-start gap-4 rounded-xl border border-dcyfr-primary-800/40 bg-dcyfr-primary-900/40 p-4 hover:border-dcyfr-accent/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white group-hover:text-dcyfr-accent-300 transition-colors line-clamp-1">
            {article.title}
          </h3>
          <p className="text-xs text-dcyfr-primary-300 mt-1 line-clamp-1">{article.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-xs text-dcyfr-primary-300">{formatDate(article.publishedAt)}</span>
          <p className="text-xs text-dcyfr-primary-300">{article.readingTime} min</p>
        </div>
      </a>
    );
  }

  const categoryColors: Record<string, string> = {
    'Agent Patterns': 'border-dcyfr-accent/30 bg-dcyfr-accent/10 text-dcyfr-accent-300',
    'Context Engineering': 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    'RAG': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    'Code Generation': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    'Infrastructure': 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    'Security': 'border-red-500/30 bg-red-500/10 text-red-300',
    'Workspace': 'border-dcyfr-primary-500/30 bg-dcyfr-primary-500/10 text-dcyfr-primary-300',
    'Releases': 'border-dcyfr-primary-500/30 bg-dcyfr-primary-500/10 text-dcyfr-primary-300',
  };

  return (
    <a
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-xl border border-dcyfr-primary-700/60 bg-dcyfr-primary-900/60 p-5 hover:border-dcyfr-accent/40 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={clsx('rounded-full border px-2.5 py-0.5 text-xs font-medium', categoryColors[article.category] ?? 'border-dcyfr-primary-600/40 bg-dcyfr-primary-800/60 text-dcyfr-primary-300')}>
          {article.category}
        </span>
        <span className="text-xs text-dcyfr-primary-300">{article.readingTime} min read</span>
      </div>

      <h3 className={clsx(
        'font-semibold text-white group-hover:text-dcyfr-accent-300 transition-colors leading-snug',
        variant === 'featured' ? 'text-lg' : 'text-base',
      )}>
        {article.title}
      </h3>
      <p className="text-sm text-dcyfr-primary-300 mt-2 leading-relaxed line-clamp-2 flex-1">
        {article.description}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-dcyfr-primary-300">
        <span>{article.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </div>
    </a>
  );
}
