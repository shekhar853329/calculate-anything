import React, { useState, useCallback } from 'react';

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function findNextLeapYear(year: number): number {
  let y = year + 1;
  while (!isLeapYear(y)) y++;
  return y;
}

function findPrevLeapYear(year: number): number {
  let y = year - 1;
  while (!isLeapYear(y)) y--;
  return y;
}

export default function LeapYearChecker() {
  const [year, setYear] = useState('');
  const [result, setResult] = useState<{ leap: boolean; next: number; prev: number } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    const y = parseInt(year, 10);
    if (!year || isNaN(y)) {
      setError('Please enter a valid year.');
      return;
    }
    if (y < 1 || y > 9999) {
      setError('Please enter a year between 1 and 9999.');
      return;
    }

    setResult({ leap: isLeapYear(y), next: findNextLeapYear(y), prev: findPrevLeapYear(y) });
  }, [year]);

  const reset = useCallback(() => {
    setYear('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `${year} is ${result.leap ? '' : 'NOT '}a leap year.\nPrevious leap year: ${result.prev}\nNext leap year: ${result.next}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, year]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="e.g. 2024"
            min="1"
            max="9999"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Check
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`rounded-xl p-6 text-center border-2 ${result.leap ? 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600' : 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600'}`}>
            <div className="text-4xl mb-2">{result.leap ? '✅' : '❌'}</div>
            <div className={`text-2xl font-bold ${result.leap ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {year} is {result.leap ? '' : 'NOT '}a leap year
            </div>
            {result.leap && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">February has 29 days in {year}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Previous leap year</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.prev}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next leap year</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.next}</div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
            <strong>Rule:</strong> A year is a leap year if divisible by 4, except century years (divisible by 100) must also be divisible by 400.
          </div>

          <button
            onClick={copyResult}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
