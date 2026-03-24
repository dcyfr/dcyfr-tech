'use client';

import { useEffect, useRef } from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Renders simple markdown content as HTML.
 * For static article content only — does not execute arbitrary scripts.
 *
 * Supports: headings (##, ###), paragraphs, bold, code blocks, inline code,
 * unordered/ordered lists, blockquotes, horizontal rules, and tables.
 */
function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Stash code blocks and inline code as placeholders so inline patterns
  // (bold, etc.) are not applied inside code spans.
  const codeStash: string[] = [];
  const stash = (raw: string) => { codeStash.push(raw); return `\x00c${codeStash.length - 1}\x00`; };

  // Code blocks (``` ... ```) — must be before other replacements
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
    stash(`<pre><code>${code.trimEnd()}</code></pre>`)
  );

  // Inline code — stash before bold so **x** inside `code` is not parsed
  html = html.replace(/`([^`]+)`/g, (_m, code) => stash(`<code>${code}</code>`));

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Tables (simple: | col | col |)
  html = html.replace(/^\|(.+)\|$/gm, (line) => {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    // Detect separator row
    if (cells.every((c) => /^[-: ]+$/.test(c))) return '<table-separator>';
    return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
  });
  // Wrap consecutive table rows
  html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (block) => {
    const rows = block.split('<table-separator>').join('');
    // First row becomes header
    const firstEnd = rows.indexOf('</tr>') + 5;
    const headerRow = rows.slice(0, firstEnd).replace(/<td>/g, '<th scope="col">').replace(/<\/td>/g, '</th>');
    const bodyRows = rows.slice(firstEnd);
    return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  });
  html = html.replace(/<table-separator>/g, '');

  // Unordered lists
  html = html.replace(/(^- .+\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li>${l.replace(/^- /, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/(^\d+\. .+\n?)+/gm, (block) => {
    const items = block.trim().split('\n').map((l) => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });

  // Task lists (checkbox items inside lists)
  html = html.replace(/<li>\[ \] /g, '<li>☐ ');
  html = html.replace(/<li>\[x\] /g, '<li>☑ ');

  // Paragraphs — lines not already wrapped in a block element
  const blockTags = new Set(['<h1', '<h2', '<h3', '<ul', '<ol', '<pre', '<blockquote', '<table', '<hr', '<tr', '<thead', '<tbody']);
  html = html
    .split('\n\n')
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      const isBlock = blockTags.has(trimmed.slice(0, 4)) || trimmed.startsWith('<table') || trimmed.startsWith('<hr');
      return isBlock ? trimmed : `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  // Restore stashed code blocks and inline code
  html = html.replace(/\x00c(\d+)\x00/g, (_m, i) => codeStash[parseInt(i)]);

  return html;
}

export function MarkdownRenderer({ content }: Readonly<MarkdownRendererProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = parseMarkdown(content);
    }
  }, [content]);

  return <div ref={ref} />;
}
