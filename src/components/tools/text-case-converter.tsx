import React, { useState, useCallback } from 'react';

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function toSentenceCase(str: string) {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
}
function toCamelCase(str: string) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
}
function toPascalCase(str: string) {
  return str.replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, _p, c) => c.toUpperCase());
}
function toSnakeCase(str: string) {
  return str
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}
function toKebabCase(str: string) {
  return str
    .replace(/\s+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}
function toConstantCase(str: string) {
  return toSnakeCase(str).toUpperCase();
}

const CASES = [
  { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
  { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
  { label: 'Title Case', fn: toTitleCase },
  { label: 'Sentence case', fn: toSentenceCase },
  { label: 'camelCase', fn: toCamelCase },
  { label: 'PascalCase', fn: toPascalCase },
  { label: 'snake_case', fn: toSnakeCase },
  { label: 'kebab-case', fn: toKebabCase },
  { label: 'CONSTANT_CASE', fn: toConstantCase },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const convert = useCallback(() => {
    if (!input.trim()) return;
    setResults(CASES.map(c => ({ label: c.label, value: c.fn(input) })));
  }, [input]);

  const copy = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          placeholder="Enter your text here..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <button onClick={convert} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
        Convert
      </button>
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div key={r.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{r.label}</span>
                <button
                  onClick={() => copy(r.value, idx)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedIdx === idx ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100 break-all">{r.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
