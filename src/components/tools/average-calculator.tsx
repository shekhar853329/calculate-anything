import React, { useState, useCallback } from 'react';

interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  range: number;
  min: number;
  max: number;
}

function calcStats(nums: number[]): StatsResult {
  const sorted = [...nums].sort((a, b) => a - b);
  const count = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const freq: Record<number, number> = {};
  for (const n of nums) freq[n] = (freq[n] ?? 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  const modes = maxFreq === 1 ? [] : Object.entries(freq).filter(([, f]) => f === maxFreq).map(([v]) => Number(v));

  return {
    count, sum, mean, median, modes,
    range: sorted[count - 1] - sorted[0],
    min: sorted[0],
    max: sorted[count - 1],
  };
}

export default function AverageCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<StatsResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!input.trim()) {
      setError('Please enter at least one number.');
      return;
    }

    const parts = input.split(/[,\s]+/).filter(Boolean);
    const nums: number[] = [];

    for (const p of parts) {
      const n = parseFloat(p);
      if (isNaN(n)) {
        setError(`"${p}" is not a valid number.`);
        return;
      }
      nums.push(n);
    }

    if (nums.length === 0) {
      setError('No valid numbers found.');
      return;
    }

    setResult(calcStats(nums));
  }, [input]);

  const reset = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const text = [
      `Count: ${result.count}`,
      `Sum: ${result.sum}`,
      `Mean: ${result.mean.toPrecision(10).replace(/\.?0+$/, '')}`,
      `Median: ${result.median}`,
      `Mode: ${result.modes.length ? result.modes.join(', ') : 'None'}`,
      `Range: ${result.range}`,
      `Min: ${result.min}`,
      `Max: ${result.max}`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const fmt = (n: number) => parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 8 });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Numbers <span className="text-gray-400 font-normal">(comma or space separated)</span>
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 10, 20, 30, 15, 25"
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Calculate
          </button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Mean', value: fmt(result.mean) },
              { label: 'Median', value: fmt(result.median) },
              { label: 'Count', value: result.count },
              { label: 'Sum', value: fmt(result.sum) },
            ].map(item => (
              <div key={item.label} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{item.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            {[
              { label: 'Mode', value: result.modes.length ? result.modes.join(', ') : 'None (all values unique)' },
              { label: 'Range', value: fmt(result.range) },
              { label: 'Min', value: fmt(result.min) },
              { label: 'Max', value: fmt(result.max) },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
