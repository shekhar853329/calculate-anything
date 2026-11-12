import React, { useState, useCallback } from 'react';

interface DateDiffResult {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  months: number;
  years: number;
  startFmt: string;
  endFmt: string;
}

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<DateDiffResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!startDate || !endDate) {
      setError('Please enter both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError('End date must be on or after start date.');
      return;
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Approximate months and years
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (end.getDate() < start.getDate()) months -= 1;
    if (months < 0) { years -= 1; months += 12; }
    const totalMonths = years * 12 + months;

    const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    setResult({ totalDays, weeks, remainingDays, months: totalMonths, years, startFmt: fmt(start), endFmt: fmt(end) });
  }, [startDate, endDate]);

  const reset = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `From ${result.startFmt} to ${result.endFmt}:\n- Total days: ${result.totalDays.toLocaleString()}\n- Weeks: ${result.weeks} weeks, ${result.remainingDays} days\n- Approximately ${result.years} years, ${result.months % 12} months`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Days', value: result.totalDays.toLocaleString(), color: 'green' },
              { label: 'Weeks', value: result.weeks.toLocaleString(), color: 'blue' },
              { label: 'Months', value: result.months, color: 'purple' },
              { label: 'Years', value: result.years, color: 'orange' },
            ].map(item => (
              <div key={item.label} className={`bg-${item.color}-50 dark:bg-${item.color}-900/30 rounded-lg p-4 text-center`}>
                <div className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">From</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.startFmt}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">To</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.endFmt}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Duration</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {result.weeks} weeks and {result.remainingDays} days
              </span>
            </div>
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
