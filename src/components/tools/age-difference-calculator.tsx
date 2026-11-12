import React, { useState, useCallback } from 'react';

interface DiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  olderDate: string;
  youngerDate: string;
}

export default function AgeDifferenceCalculator() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!date1 || !date2) {
      setError('Please enter both dates.');
      return;
    }

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (d1.getTime() === d2.getTime()) {
      setError('Both dates are the same — the difference is zero.');
      return;
    }

    const earlier = d1 < d2 ? d1 : d2;
    const later = d1 < d2 ? d2 : d1;

    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.round(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    setResult({ years, months, days, totalDays, olderDate: fmt(earlier), youngerDate: fmt(later) });
  }, [date1, date2]);

  const reset = useCallback(() => {
    setDate1('');
    setDate2('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `Age difference: ${result.years} years, ${result.months} months, ${result.days} days\nTotal days: ${result.totalDays.toLocaleString()}`;
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Date</label>
            <input
              type="date"
              value={date1}
              onChange={e => setDate1(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Second Date</label>
            <input
              type="date"
              value={date2}
              onChange={e => setDate2(e.target.value)}
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
            Calculate Difference
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
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Years', value: result.years },
              { label: 'Months', value: result.months },
              { label: 'Days', value: result.days },
            ].map(item => (
              <div key={item.label} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{item.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total days between</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.totalDays.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Earlier date</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.olderDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Later date</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.youngerDate}</span>
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
