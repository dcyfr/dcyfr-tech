import articles from '@/data/articles.json';
import type { Article } from '@/lib/types';

export const dynamic = 'force-static';

export async function GET() {
  const BASE = 'https://dcyfr.tech';
  const typed = (articles as Article[]).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const items = typed
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE}/articles/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/articles/${a.slug}</guid>
      <description><![CDATA[${a.description}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${a.category}]]></category>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DCYFR Research</title>
    <link>${BASE}</link>
    <description>Deep dives into AI agent patterns, context engineering, and production-ready AI infrastructure.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
