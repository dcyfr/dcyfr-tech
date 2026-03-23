import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import articles from '@/data/articles.json';
import type { Article } from '@/lib/types';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (articles as Article[]).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = (articles as Article[]).find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://dcyfr.tech/articles/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function ArticlePage({ params }: Readonly<Props>) {
  const { slug } = await params;
  const article = (articles as Article[]).find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            author: { '@type': 'Organization', name: article.author },
            datePublished: article.publishedAt,
            publisher: { '@type': 'Organization', name: 'DCYFR', url: 'https://dcyfr.tech' },
            url: `https://dcyfr.tech/articles/${article.slug}`,
          }),
        }}
      />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-dcyfr-primary-300" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors">dcyfr.tech</a>
            <span aria-hidden="true">/</span>
            <a href="/articles" className="hover:text-white transition-colors">Articles</a>
            <span aria-hidden="true">/</span>
            <span className="text-dcyfr-primary-200" aria-current="page">{article.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full border border-dcyfr-accent/30 bg-dcyfr-accent/10 text-dcyfr-accent-300 px-2.5 py-0.5 text-xs font-medium">
                {article.category}
              </span>
              <span className="text-xs text-dcyfr-primary-300">{article.readingTime} min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{article.title}</h1>
            <p className="text-lg text-dcyfr-primary-300 leading-relaxed mb-6">{article.description}</p>
            <div className="flex items-center gap-3 text-sm text-dcyfr-primary-300 pb-6 border-b border-dcyfr-primary-800/60">
              <span>{article.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
          </header>

          {/* Content */}
          <div className="prose-dcyfr">
            <MarkdownRenderer content={article.content} />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-dcyfr-primary-800/60">
              <p className="text-xs text-dcyfr-primary-300 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-dcyfr-primary-700/60 bg-dcyfr-primary-800/60 px-2.5 py-0.5 text-xs text-dcyfr-primary-200 hover:border-dcyfr-accent/40 hover:text-white transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10">
            <a href="/articles" className="text-sm text-dcyfr-primary-300 hover:text-white transition-colors">
              ← All articles
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
