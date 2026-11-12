import React, { useState, useCallback } from 'react';

function countWorkingDays(start: Date, end: Date, holidays: Date[]): number {
  let count = 0;
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  const holidaySet = new Set(holidays.map(h => h.toISOString().split('T')[0]));

  while (current <= endDate) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      const iso = current.toISOString().split('T')[0];
      if (!holidaySet.has(iso)) count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default function WorkingDaysCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [holidayInput, setHolidayInput] = useState('');
  const [result, setResult] = useState<{ workingDays: number; totalDays: number; weekendDays: number; holidayCount: number } | null>(null);
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

    // Parse holidays
    const holidays: Date[] = [];
    if (holidayInput.trim()) {
      const lines = holidayInput.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const d = new Date(line);
        if (isNaN(d.getTime())) {
          setError(`Invalid holiday date: "${line}". Use YYYY-MM-DD format.`);
          return;
        }
        holidays.push(d);
      }
    }

    const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const workingDays = countWorkingDays(start, end, holidays);
    const weekendDays = totalDays - workingDays - holidays.filter(h => {
      const dow = h.getDay();
      return dow !== 0 && dow !== 6;
    }).length;

    setResult({ workingDays, totalDays, weekendDays, holidayCount: holidays.length });
  }, [startDate, endDate, holidayInput]);

  const reset = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setHolidayInput('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `Working days: ${result.workingDays}\nTotal days: ${result.totalDays}\nWeekend days: ${result.weekendDays}\nHolidays excluded: ${result.holidayCount}`;
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Holidays to Exclude <span className="text-gray-400 font-normal">(optional, one date per line, YYYY-MM-DD)</span>
          </label>
          <textarea
            value={holidayInput}
            onChange={e => setHolidayInput(e.target.value)}
            placeholder="2024-12-25&#10;2024-01-01"
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
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
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400">{result.workingDays}</div>
            <div className="text-lg text-gray-700 dark:text-gray-300 mt-1">Working Days</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Days', value: result.totalDays },
              { label: 'Weekend Days', value: result.weekendDays },
              { label: 'Holidays', value: result.holidayCount },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
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
