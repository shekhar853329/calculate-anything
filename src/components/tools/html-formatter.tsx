import React, { useState, useCallback } from 'react';

function formatHTML(html: string): string {
  const INLINE = new Set(['a','abbr','acronym','b','bdo','big','br','cite','code','dfn','em',
    'i','img','input','kbd','label','map','object','q','samp','select','small','span',
    'strong','sub','sup','textarea','time','tt','var']);
  let indent = 0;
  const lines: string[] = [];
  // Simple token-based formatter
  const tokens = html
    .replace(/>\s+</g, '><')
    .split(/(<[^>]+>)/g)
    .filter(t => t.trim() !== '');

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      lines.push('  '.repeat(indent) + token.trim());
      continue;
    }
    const tagMatch = token.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
    const tag = tagMatch ? tagMatch[1].toLowerCase() : '';
    const isClose = token.startsWith('</');
    const isSelfClose = token.endsWith('/>');
    const isInline = INLINE.has(tag);

    if (isClose && !isInline) indent = Math.max(0, indent - 1);
    lines.push('  '.repeat(indent) + token);
    if (!isClose && !isSelfClose && !isInline) indent++;
  }
  return lines.join('\n');
}

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) return;
    setOutput(formatHTML(input));
  }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const reset = useCallback(() => { setInput(''); setOutput(''); }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HTML Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder="<html><head></head><body><p>Hello</p></body></html>"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <div className="flex gap-3">
        <button onClick={format} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Format</button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset</button>
      </div>
      {output && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
          <pre className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono overflow-auto max-h-64 whitespace-pre-wrap">
            {output}
          </pre>
          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
            <button onClick={download} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
