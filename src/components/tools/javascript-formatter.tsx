import React, { useState, useCallback } from 'react';

// Basic JS beautifier (indent tracking via brace depth)
function basicBeautify(code: string): string {
  let indent = 0;
  const lines: string[] = [];
  // Split by common block delimiters while preserving strings
  const tokens = code
    .replace(/\r\n/g, '\n')
    .replace(/([{};])/g, '\n$1\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '');

  for (const token of tokens) {
    if (token === '}' || token === '];' || token === ')' || token === ');') {
      indent = Math.max(0, indent - 1);
    }
    lines.push('  '.repeat(indent) + token);
    if (token.endsWith('{') || token.endsWith('[') || token.endsWith('(')) {
      indent++;
    }
  }
  return lines.join('\n');
}

function basicMinify(code: string): string {
  return code
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,=+\-*/|&<>!])\s*/g, '$1')
    .trim();
}

export default function JavascriptFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const format = useCallback(async () => {
    setError('');
    if (!input.trim()) return;
    try {
      // Try prettier if available on window
      const win = window as any;
      if (win.prettier && win.prettierPlugins) {
        const formatted = await win.prettier.format(input, {
          parser: 'babel',
          plugins: win.prettierPlugins,
        });
        setOutput(formatted);
      } else {
        setOutput(basicBeautify(input));
      }
    } catch (e: any) {
      setError(`Format error: ${e.message}`);
      setOutput(basicBeautify(input));
    }
  }, [input]);

  const minify = useCallback(() => {
    setError('');
    if (!input.trim()) return;
    setOutput(basicMinify(input));
  }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.js';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const reset = useCallback(() => { setInput(''); setOutput(''); setError(''); }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">JavaScript Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder="function hello(){return 'world';}"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      {error && <p className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">{error}</p>}
      <div className="flex gap-3">
        <button onClick={format} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors">Format</button>
        <button onClick={minify} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg transition-colors">Minify</button>
        <button onClick={reset} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset</button>
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
