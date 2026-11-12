import React, { useState, useCallback } from 'react';

type Unit = 'days' | 'weeks' | 'months' | 'years';
type Operation = 'add' | 'subtract';

export default function DateAddSubtract() {
  const [startDate, setStartDate] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('days');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<string | null>(null);
  const [resultIso, setResultIso] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!startDate) {
      setError('Please enter a starting date.');
      return;
    }

    const num = parseInt(amount, 10);
    if (!amount || isNaN(num) || num < 0) {
      setError('Please enter a valid non-negative number.');
      return;
    }

    const date = new Date(startDate);
    const factor = operation === 'subtract' ? -1 : 1;
    const delta = num * factor;

    switch (unit) {
      case 'days':
        date.setDate(date.getDate() + delta);
        break;
      case 'weeks':
        date.setDate(date.getDate() + delta * 7);
        break;
      case 'months':
        date.setMonth(date.getMonth() + delta);
        break;
      case 'years':
        date.setFullYear(date.getFullYear() + delta);
        break;
    }

    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const iso = date.toISOString().split('T')[0];

    setResult(formatted);
    setResultIso(iso);
  }, [startDate, amount, unit, operation]);

  const reset = useCallback(() => {
    setStartDate('');
    setAmount('');
    setUnit('days');
    setOperation('add');
    setResult(null);
    setResultIso('');
    setError('');
    setCopied(false);
  }, []);

  const copyResult = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(`${result} (${resultIso})`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, resultIso]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operation</label>
            <select
              value={operation}
              onChange={e => setOperation(e.target.value as Operation)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 30"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value as Unit)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
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
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</p>
            <p className="text-xl font-semibold text-green-700 dark:text-green-300">{result}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">{resultIso}</p>
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
