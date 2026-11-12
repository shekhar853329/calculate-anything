import React, { useState } from 'react';

interface Unit {
  key: string;
  label: string;
  toSqMeters: number;
}

const UNITS: Unit[] = [
  { key: 'sqmm', label: 'Square Millimeter (mm²)', toSqMeters: 1e-6 },
  { key: 'sqcm', label: 'Square Centimeter (cm²)', toSqMeters: 1e-4 },
  { key: 'sqm', label: 'Square Meter (m²)', toSqMeters: 1 },
  { key: 'sqkm', label: 'Square Kilometer (km²)', toSqMeters: 1e6 },
  { key: 'sqin', label: 'Square Inch (in²)', toSqMeters: 6.4516e-4 },
  { key: 'sqft', label: 'Square Foot (ft²)', toSqMeters: 0.092903 },
  { key: 'sqyd', label: 'Square Yard (yd²)', toSqMeters: 0.836127 },
  { key: 'acre', label: 'Acre', toSqMeters: 4046.86 },
  { key: 'ha', label: 'Hectare (ha)', toSqMeters: 10000 },
  { key: 'sqmi', label: 'Square Mile (mi²)', toSqMeters: 2.58999e6 },
];

function formatValue(val: number): string {
  if (!isFinite(val)) return '—';
  if (val === 0) return '0';
  if (Math.abs(val) >= 1e15 || (Math.abs(val) < 1e-9 && val !== 0)) {
    return val.toExponential(6);
  }
  return parseFloat(val.toPrecision(10)).toString();
}

export default function AreaConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('sqm');
  const [copied, setCopied] = useState('');

  const { results, errorMsg } = React.useMemo(() => {
    const num = parseFloat(inputValue);
    if (inputValue === '' || isNaN(num)) return { results: null, errorMsg: '' };
    if (num < 0) return { results: null, errorMsg: 'Area cannot be negative.' };
    const from = UNITS.find(u => u.key === fromUnit)!;
    const inSqMeters = num * from.toSqMeters;
    return { results: UNITS.map(u => ({ ...u, result: inSqMeters / u.toSqMeters })), errorMsg: '' };
  }, [inputValue, fromUnit]);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const handleReset = () => {
    setInputValue('');
    setFromUnit('sqm');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Area Converter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter area"
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

        {errorMsg && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMsg}</p>}
        <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">Reset</button>
      </div>

      {results && !errorMsg && (
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
