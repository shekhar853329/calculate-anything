import React, { useState, useCallback } from 'react';

interface Unit {
  key: string;
  label: string;
  toMl: number; // conversion to milliliters
}

const UNITS: Unit[] = [
  { key: 'ml', label: 'Milliliter (ml)', toMl: 1 },
  { key: 'l', label: 'Liter (L)', toMl: 1000 },
  { key: 'cbm', label: 'Cubic Meter (m³)', toMl: 1_000_000 },
  { key: 'tsp', label: 'Teaspoon (tsp, US)', toMl: 4.92892 },
  { key: 'tbsp', label: 'Tablespoon (tbsp, US)', toMl: 14.7868 },
  { key: 'floz', label: 'Fluid Ounce (fl oz, US)', toMl: 29.5735 },
  { key: 'cup', label: 'Cup (US)', toMl: 236.588 },
  { key: 'pt', label: 'Pint (pt, US)', toMl: 473.176 },
  { key: 'qt', label: 'Quart (qt, US)', toMl: 946.353 },
  { key: 'gal', label: 'Gallon (gal, US)', toMl: 3785.41 },
];

function formatValue(val: number): string {
  if (!isFinite(val)) return '—';
  if (val === 0) return '0';
  if (Math.abs(val) >= 1e12 || (Math.abs(val) < 1e-6 && val !== 0)) {
    return val.toExponential(6);
  }
  return parseFloat(val.toPrecision(8)).toString();
}

export default function VolumeConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('l');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    const num = parseFloat(inputValue);
    if (inputValue === '' || isNaN(num)) return null;
    if (num < 0) return null;
    const from = UNITS.find(u => u.key === fromUnit)!;
    const inMl = num * from.toMl;
    return UNITS.map(u => ({ ...u, result: inMl / u.toMl }));
  }, [inputValue, fromUnit]);

  const handleChange = (val: string) => {
    setInputValue(val);
    const num = parseFloat(val);
    if (val !== '' && !isNaN(num) && num < 0) {
      setError('Volume cannot be negative.');
    } else {
      setError('');
    }
  };

  const results = convert();

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const handleReset = () => {
    setInputValue('');
    setFromUnit('l');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Volume Converter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={e => handleChange(e.target.value)}
              placeholder="Enter volume"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Unit</label>
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
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}
        <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">Reset</button>
      </div>

      {results && !error && inputValue !== '' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Conversion Results</h3>
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
                    <td className="py-2 px-3 text-right font-mono text-gray-900 dark:text-gray-100">{formatValue(row.result)}</td>
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
