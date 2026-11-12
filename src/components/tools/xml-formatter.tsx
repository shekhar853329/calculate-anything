import React, { useState, useCallback } from 'react';

function formatXML(xml: string): { result: string; error: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return { result: '', error: parserError.textContent || 'Invalid XML' };
    }
    return { result: serializeNode(doc.documentElement, 0), error: '' };
  } catch (e: any) {
    return { result: '', error: e.message };
  }
}

function serializeNode(node: Element, depth: number): string {
  const indent = '  '.repeat(depth);
  const attrs = Array.from(node.attributes)
    .map(a => ` ${a.name}="${a.value}"`)
    .join('');

  const children = Array.from(node.childNodes).filter(
    n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent?.trim())
  );

  if (children.length === 0) {
    const text = node.textContent?.trim();
    if (text) return `${indent}<${node.tagName}${attrs}>${text}</${node.tagName}>`;
    return `${indent}<${node.tagName}${attrs} />`;
  }

  const textOnly = children.every(n => n.nodeType === 3);
  if (textOnly) {
    return `${indent}<${node.tagName}${attrs}>${node.textContent?.trim()}</${node.tagName}>`;
  }

  const inner = children
    .map(n => n.nodeType === 1 ? serializeNode(n as Element, depth + 1) : '')
    .filter(Boolean)
    .join('\n');

  return `${indent}<${node.tagName}${attrs}>\n${inner}\n${indent}</${node.tagName}>`;
}

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    setError('');
    if (!input.trim()) return;
    const { result, error: err } = formatXML(input);
    if (err) { setError(err); setOutput(''); }
    else { setOutput('<?xml version="1.0" encoding="UTF-8"?>\n' + result); }
  }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const reset = useCallback(() => { setInput(''); setOutput(''); setError(''); }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">XML Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder="<root><item>value</item></root>"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}
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
