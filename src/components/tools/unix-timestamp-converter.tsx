import React, { useState, useEffect, useCallback } from 'react';

export default function UnixTimestampConverter() {
  const [currentUnix, setCurrentUnix] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [tsResult, setTsResult] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [tsError, setTsError] = useState('');
  const [dateError, setDateError] = useState('');
  const [copiedTs, setCopiedTs] = useState(false);
  const [copiedDate, setCopiedDate] = useState(false);

  // Auto-update current unix time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUnix(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = useCallback(() => {
    setTsError('');
    setTsResult('');

    if (!tsInput.trim()) {
      setTsError('Please enter a Unix timestamp.');
      return;
    }

    const ts = parseInt(tsInput.trim(), 10);
    if (isNaN(ts)) {
      setTsError('Invalid timestamp. Please enter a numeric value.');
      return;
    }

    // Handle milliseconds vs seconds
    const ms = tsInput.trim().length >= 13 ? ts : ts * 1000;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setTsError('Timestamp out of range.');
      return;
    }

    const local = date.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short',
    });
    const iso = date.toISOString();

    setTsResult(`Local: ${local}\nUTC: ${iso}`);
  }, [tsInput]);

  const convertDate = useCallback(() => {
    setDateError('');
    setDateResult('');

    if (!dateInput) {
      setDateError('Please enter a date.');
      return;
    }

    const dateStr = timeInput ? `${dateInput}T${timeInput}` : `${dateInput}T00:00:00`;
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      setDateError('Invalid date/time combination.');
      return;
    }

    const unixSec = Math.floor(date.getTime() / 1000);
    const unixMs = date.getTime();

    setDateResult(`Unix (seconds): ${unixSec}\nUnix (milliseconds): ${unixMs}`);
  }, [dateInput, timeInput]);

  const copyCurrentUnix = () => {
    navigator.clipboard.writeText(String(currentUnix)).then(() => {
      setCopiedTs(true);
      setTimeout(() => setCopiedTs(false), 2000);
    });
  };

  const copyDateResult = () => {
    if (!dateResult) return;
    navigator.clipboard.writeText(dateResult).then(() => {
      setCopiedDate(true);
      setTimeout(() => setCopiedDate(false), 2000);
    });
  };

  const useCurrent = () => {
    setTsInput(String(currentUnix));
  };

  return (
    <div className="space-y-6">
      {/* Live current time */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Current Unix Timestamp</div>
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">{currentUnix}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={useCurrent}
              className="text-sm px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
            >
              Use This
            </button>
            <button
              onClick={copyCurrentUnix}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {copiedTs ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Timestamp → Date */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Unix Timestamp → Human Readable</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={tsInput}
            onChange={e => setTsInput(e.target.value)}
            placeholder="e.g. 1700000000"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && convertTimestamp()}
          />
          <button
            onClick={convertTimestamp}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Convert
          </button>
        </div>
        {tsError && <p className="text-sm text-red-600 dark:text-red-400">{tsError}</p>}
        {tsResult && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <pre className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap font-mono">{tsResult}</pre>
          </div>
        )}
      </div>

      {/* Date → Timestamp */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Date & Time → Unix Timestamp</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="date"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="time"
            step="1"
            value={timeInput}
            onChange={e => setTimeInput(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={convertDate}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Convert to Unix
        </button>
        {dateError && <p className="text-sm text-red-600 dark:text-red-400">{dateError}</p>}
        {dateResult && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 space-y-2">
            <pre className="text-sm text-green-800 dark:text-green-200 font-mono whitespace-pre-wrap">{dateResult}</pre>
            <button
              onClick={copyDateResult}
              className="text-xs px-3 py-1 rounded border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              {copiedDate ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
