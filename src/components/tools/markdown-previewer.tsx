import React, { useState, useMemo } from 'react';

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-auto text-sm font-mono my-3"><code>${code.trim()}</code></pre>`);
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 rounded px-1 font-mono text-sm">$1</code>');
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>');
  // Headers
  html = html.replace(/^###### (.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-1">$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5 class="text-base font-bold mt-4 mb-1">$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-1">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-5 mb-3">$1</h1>');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-4" />');
  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded my-2" />');
  // Unordered lists
  html = html.replace(/^(\s*[-*+] .+(\n|$))+/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li class="ml-4 list-disc">${l.replace(/^\s*[-*+] /, '')}</li>`).join('');
    return `<ul class="my-2 space-y-1">${items}</ul>`;
  });
  // Ordered lists
  html = html.replace(/^(\s*\d+\. .+(\n|$))+/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li class="ml-4 list-decimal">${l.replace(/^\s*\d+\. /, '')}</li>`).join('');
    return `<ol class="my-2 space-y-1">${items}</ol>`;
  });
  // Paragraphs
  html = html.replace(/\n{2,}/g, '</p><p class="my-2">');
  html = `<p class="my-2">${html}</p>`;
  html = html.replace(/<p class="my-2"><\/p>/g, '');

  return html;
}

const SAMPLE = `# Markdown Previewer

## Features

Write **bold**, *italic*, or \`inline code\`.

> Blockquotes are supported.

### Lists

- Item one
- Item two
- Item three

### Code Block

\`\`\`
function hello() {
  return "world";
}
\`\`\`

[Visit GitHub](https://github.com)
`;

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const preview = useMemo(() => parseMarkdown(markdown), [markdown]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Markdown Input</label>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</label>
          <div
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 overflow-auto text-gray-900 dark:text-gray-100 text-sm prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
      <button
        onClick={() => setMarkdown('')}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        Clear
      </button>
    </div>
  );
}
