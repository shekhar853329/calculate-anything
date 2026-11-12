import React, { useState, useCallback } from 'react';

function csvToJson(csv: string, hasHeaders: boolean, delimiter: string): { json: string; error: string } {
  try {
    const lines = csv.trim().split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return { json: '', error: 'Input is empty.' };

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (ch === delimiter && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
      result.push(current);
      return result;
    };

    if (hasHeaders) {
      const headers = parseLine(lines[0]);
      const rows = lines.slice(1).map(line => {
        const cells = parseLine(line);
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h.trim()] = cells[i]?.trim() ?? ''; });
        return obj;
      });
      return { json: JSON.stringify(rows, null, 2), error: '' };
    } else {
      const rows = lines.map(line => parseLine(line).map(c => c.trim()));
      return { json: JSON.stringify(rows, null, 2), error: '' };
    }
  } catch (e: any) {
    return { json: '', error: e.message };
  }
}

export default function CsvToJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError('');
    const { json, error: err } = csvToJson(input, hasHeaders, delimiter === '\\t' ? '\t' : delimiter);
    if (err) { setError(err); setOutput(''); }
    else setOutput(json);
  }, [input, hasHeaders, delimiter]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const reset = useCallback(() => { setInput(''); setOutput(''); setError(''); }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CSV Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder={'name,age,city\nAlice,30,New York\nBob,25,London'}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Delimiter</label>
          <select value={delimiter} onChange={e => setDelimiter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none mt-4">
          <input type="checkbox" checked={hasHeaders} onChange={e => setHasHeaders(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">First row is headers</span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3">
        <button onClick={convert} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Convert</button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset</button>
      </div>

      {output && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">JSON Output</label>
          <pre className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono overflow-auto max-h-56 whitespace-pre-wrap">
            {output}
          </pre>
          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
            <button onClick={download} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              Download JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
