import React, { useState, useCallback } from 'react';

type Option = {
  key: string;
  label: string;
  fn: (s: string) => string;
};

const OPTIONS: Option[] = [
  { key: 'trim', label: 'Trim whitespace', fn: s => s.split('\n').map(l => l.trim()).join('\n') },
  { key: 'extraSpaces', label: 'Remove extra spaces', fn: s => s.replace(/[ \t]+/g, ' ') },
  { key: 'blankLines', label: 'Remove blank lines', fn: s => s.split('\n').filter(l => l.trim() !== '').join('\n') },
  { key: 'reverse', label: 'Reverse text', fn: s => s.split('').reverse().join('') },
  { key: 'sortLines', label: 'Sort lines alphabetically', fn: s => s.split('\n').sort((a, b) => a.localeCompare(b)).join('\n') },
  { key: 'removeDups', label: 'Remove duplicate lines', fn: s => [...new Set(s.split('\n'))].join('\n') },
  { key: 'lineNumbers', label: 'Add line numbers', fn: s => s.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n') },
];

export default function TextFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggle = useCallback((key: string) => {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const apply = useCallback(() => {
    let result = input;
    for (const opt of OPTIONS) {
      if (selected[opt.key]) result = opt.fn(result);
    }
    setOutput(result);
  }, [input, selected]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const reset = useCallback(() => {
    setInput('');
    setOutput('');
    setSelected({});
    setCopied(false);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Text</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={6}
          placeholder="Paste your text here..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transformations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OPTIONS.map(opt => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!selected[opt.key]}
                onChange={() => toggle(opt.key)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={apply} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
          Apply
        </button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Reset
        </button>
      </div>
      {output !== '' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
          <textarea
            readOnly
            value={output}
            rows={6}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm resize-y"
          />
          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
