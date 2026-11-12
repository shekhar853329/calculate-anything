import React, { useState, useCallback } from 'react';

interface DurationResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalMinutes: number;
  isOvernight: boolean;
}

export default function TimeDurationCalculator() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [result, setResult] = useState<DurationResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const parseTime = (t: string): number => {
    const [h, m, s = '0'] = t.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  };

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!startTime || !endTime) {
      setError('Please enter both start and end times.');
      return;
    }

    let startSec = parseTime(startTime);
    let endSec = parseTime(endTime);
    let isOvernight = false;

    if (endSec < startSec) {
      // Overnight: add 24 hours
      endSec += 24 * 3600;
      isOvernight = true;
    }

    const totalSeconds = endSec - startSec;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setResult({ hours, minutes, seconds, totalSeconds, totalMinutes: Math.floor(totalSeconds / 60), isOvernight });
  }, [startTime, endTime]);

  const reset = useCallback(() => {
    setStartTime('');
    setEndTime('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `Duration: ${result.hours}h ${result.minutes}m ${result.seconds}s\nTotal minutes: ${result.totalMinutes}\nTotal seconds: ${result.totalSeconds}${result.isOvernight ? '\n(Overnight duration)' : ''}`;
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
            <input
              type="time"
              step="1"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
            <input
              type="time"
              step="1"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
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
            Calculate Duration
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
          {result.isOvernight && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-700 dark:text-yellow-300">
              🌙 Overnight duration detected — end time is treated as next day.
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Hours', value: result.hours },
              { label: 'Minutes', value: result.minutes },
              { label: 'Seconds', value: result.seconds },
            ].map(item => (
              <div key={item.label} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total minutes</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.totalMinutes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total seconds</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{result.totalSeconds.toLocaleString()}</span>
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
