import React, { useState, useCallback } from 'react';

interface DaysUntilResult {
  days: number;
  isPast: boolean;
  targetFmt: string;
  weeks: number;
  remainingDays: number;
}

export default function DaysUntilCalculator() {
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState<DaysUntilResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!targetDate) {
      setError('Please enter a target date.');
      return;
    }

    const target = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const days = Math.round(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    const isPast = diffMs < 0;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    const targetFmt = target.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    setResult({ days, isPast, targetFmt, weeks, remainingDays });
  }, [targetDate]);

  const reset = useCallback(() => {
    setTargetDate('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = result.isPast
      ? `${result.days} days since ${result.targetFmt}`
      : `${result.days} days until ${result.targetFmt}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  // Quick date shortcuts
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setTargetDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Quick:</span>
          {[
            { label: '+7 days', days: 7 },
            { label: '+30 days', days: 30 },
            { label: '+90 days', days: 90 },
            { label: '+1 year', days: 365 },
          ].map(q => (
            <button
              key={q.label}
              onClick={() => setQuickDate(q.days)}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Calculate
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
        <div className="space-y-3">
          <div className={`rounded-lg p-6 text-center ${result.isPast ? 'bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800' : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'}`}>
            <div className={`text-5xl font-bold mb-2 ${result.isPast ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {result.days.toLocaleString()}
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              {result.days === 0 ? 'That\'s today!' : result.isPast ? 'days ago' : 'days to go'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{result.targetFmt}</div>
          </div>

          {result.days > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">In weeks</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {result.weeks} weeks{result.remainingDays > 0 ? ` and ${result.remainingDays} days` : ''}
              </span>
            </div>
          )}

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
