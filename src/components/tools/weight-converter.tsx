import React, { useState, useCallback } from 'react';

interface Unit {
  key: string;
  label: string;
  toKg: number;
}

const UNITS: Unit[] = [
  { key: 'mg', label: 'Milligram (mg)', toKg: 1e-6 },
  { key: 'g', label: 'Gram (g)', toKg: 0.001 },
  { key: 'kg', label: 'Kilogram (kg)', toKg: 1 },
  { key: 't', label: 'Metric Ton (t)', toKg: 1000 },
  { key: 'oz', label: 'Ounce (oz)', toKg: 0.0283495 },
  { key: 'lb', label: 'Pound (lb)', toKg: 0.453592 },
  { key: 'stone', label: 'Stone (st)', toKg: 6.35029 },
];

function formatValue(val: number): string {
  if (!isFinite(val)) return '—';
  if (val === 0) return '0';
  if (Math.abs(val) >= 1e12 || (Math.abs(val) < 1e-9 && val !== 0)) {
    return val.toExponential(6);
  }
  return parseFloat(val.toPrecision(10)).toString();
}

export default function WeightConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('lb');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const compute = useCallback(() => {
    const num = parseFloat(inputValue);
    if (inputValue === '' || isNaN(num)) return null;
    if (num < 0) return null;
    const from = UNITS.find(u => u.key === fromUnit)!;
    const inKg = num * from.toKg;
    return UNITS.map(u => ({ ...u, result: inKg / u.toKg }));
  }, [inputValue, fromUnit]);

  const handleChange = (val: string) => {
    setInputValue(val);
    const num = parseFloat(val);
    if (val !== '' && !isNaN(num) && num < 0) {
      setError('Weight cannot be negative.');
    } else {
      setError('');
    }
  };

  const results = compute();
  const directResult = results?.find(u => u.key === toUnit);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const handleReset = () => {
    setInputValue('');
    setFromUnit('kg');
    setToUnit('lb');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Weight Converter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={e => handleChange(e.target.value)}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UNITS.map(u => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
            <select
              value={toUnit}
              onChange={e => setToUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UNITS.map(u => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}

        {directResult && !error && inputValue !== '' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-3 mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Result</p>
            <p className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-300">
              {formatValue(directResult.result)} <span className="text-lg font-normal">{directResult.label}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleReset}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
        >
          Reset
        </button>
      </div>

      {results && !error && inputValue !== '' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">All Units</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Unit</th>
                  <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Value</th>
                  <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Copy</th>
                </tr>
              </thead>
              <tbody>
                {results.map(row => (
                  <tr
                    key={row.key}
                    className={`border-b border-gray-100 dark:border-gray-700 ${row.key === fromUnit ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{row.label}</td>
                    <td className="py-2 px-3 text-right font-mono text-gray-900 dark:text-gray-100">
                      {formatValue(row.result)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleCopy(formatValue(row.result), row.key)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {copied === row.key ? 'Copied!' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
