import React, { useState, useCallback } from 'react';

type DiffLine = { type: 'added' | 'removed' | 'unchanged'; text: string };

function computeDiff(original: string, modified: string): DiffLine[] {
  const a = original.split('\n');
  const b = modified.split('\n');
  const m = a.length, n = b.length;
  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'unchanged', text: a[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: b[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', text: a[i - 1] });
      i--;
    }
  }
  return result;
}

export default function TextDifferenceChecker() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const compare = useCallback(() => {
    setDiff(computeDiff(original, modified));
  }, [original, modified]);

  const reset = useCallback(() => {
    setOriginal('');
    setModified('');
    setDiff(null);
  }, []);

  const added = diff?.filter(d => d.type === 'added').length ?? 0;
  const removed = diff?.filter(d => d.type === 'removed').length ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original</label>
          <textarea
            value={original}
            onChange={e => setOriginal(e.target.value)}
            rows={8}
            placeholder="Paste original text..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modified</label>
          <textarea
            value={modified}
            onChange={e => setModified(e.target.value)}
            rows={8}
            placeholder="Paste modified text..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={compare} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
          Compare
        </button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Reset
        </button>
      </div>
      {diff && (
        <div className="space-y-3">
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">+{added} added</span>
            <span className="text-red-600 dark:text-red-400 font-medium">-{removed} removed</span>
          </div>
          <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-auto max-h-80">
            {diff.map((line, idx) => (
              <div
                key={idx}
                className={`flex px-3 py-0.5 font-mono text-sm ${
                  line.type === 'added' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                  line.type === 'removed' ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                  'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="select-none w-5 mr-2 opacity-60">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                <span className="whitespace-pre-wrap break-all">{line.text || '\u00a0'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
