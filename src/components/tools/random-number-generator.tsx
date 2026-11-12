import React, { useState, useCallback } from 'react';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('10');
  const [unique, setUnique] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setError('');
    setCopied(false);

    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    const countVal = parseInt(count, 10);

    if (isNaN(minVal) || isNaN(maxVal)) {
      setError('Please enter valid numbers for Min and Max.');
      return;
    }
    if (minVal >= maxVal) {
      setError('Max must be greater than Min.');
      return;
    }
    if (isNaN(countVal) || countVal < 1 || countVal > 10000) {
      setError('Count must be between 1 and 10,000.');
      return;
    }

    const rangeSize = maxVal - minVal + 1;
    if (unique && countVal > rangeSize) {
      setError(`Cannot generate ${countVal} unique integers in range [${minVal}, ${maxVal}] (only ${Math.floor(rangeSize)} possible).`);
      return;
    }

    const result: number[] = [];

    if (unique) {
      const pool = Array.from({ length: Math.floor(rangeSize) }, (_, i) => Math.floor(minVal) + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      result.push(...pool.slice(0, countVal));
    } else {
      for (let i = 0; i < countVal; i++) {
        result.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + Math.floor(minVal));
      }
    }

    setNumbers(result);
  }, [min, max, count, unique]);

  const copy = useCallback(() => {
    if (!numbers.length) return;
    navigator.clipboard.writeText(numbers.join(', ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [numbers]);

  const reset = useCallback(() => {
    setMin('1'); setMax('100'); setCount('10');
    setUnique(false); setNumbers([]); setError(''); setCopied(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min</label>
            <input
              type="number"
              value={min}
              onChange={e => setMin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max</label>
            <input
              type="number"
              value={max}
              onChange={e => setMax(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Count</label>
            <input
              type="number"
              min="1"
              max="10000"
              value={count}
              onChange={e => setCount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={unique}
            onChange={e => setUnique(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Unique numbers only</span>
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={generate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Generate
          </button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {numbers.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{numbers.length} number(s) generated</span>
            <button onClick={generate} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Regenerate
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
            {numbers.length <= 100 ? (
              <div className="flex flex-wrap gap-2">
                {numbers.map((n, i) => (
                  <span key={i} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-2.5 py-1 rounded text-sm font-mono">
                    {n}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-words">
                {numbers.join(', ')}
              </p>
            )}
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 grid grid-cols-3 gap-2 text-sm text-center">
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{Math.min(...numbers)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Min</div>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{Math.max(...numbers)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Max</div>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {(numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
            </div>
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy All Numbers'}
          </button>
        </div>
      )}
    </div>
  );
}
