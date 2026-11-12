import React, { useState } from 'react';

type TempUnit = 'C' | 'F' | 'K' | 'R';

interface TempResult {
  unit: TempUnit;
  label: string;
  value: number;
  formula: string;
}

function toCelsius(value: number, from: TempUnit): number {
  switch (from) {
    case 'C': return value;
    case 'F': return (value - 32) * 5 / 9;
    case 'K': return value - 273.15;
    case 'R': return (value - 491.67) * 5 / 9;
  }
}

function fromCelsius(celsius: number, to: TempUnit): number {
  switch (to) {
    case 'C': return celsius;
    case 'F': return celsius * 9 / 5 + 32;
    case 'K': return celsius + 273.15;
    case 'R': return (celsius + 273.15) * 9 / 5;
  }
}

function getFormula(value: number, from: TempUnit, to: TempUnit, result: number): string {
  const v = parseFloat(value.toString()).toFixed(4);
  const r = parseFloat(result.toFixed(4));
  if (from === to) return `${v}°${from} = ${r}°${to}`;
  switch (`${from}-${to}`) {
    case 'C-F': return `(${v} × 9/5) + 32 = ${r}°F`;
    case 'F-C': return `(${v} − 32) × 5/9 = ${r}°C`;
    case 'C-K': return `${v} + 273.15 = ${r} K`;
    case 'K-C': return `${v} − 273.15 = ${r}°C`;
    case 'C-R': return `(${v} + 273.15) × 9/5 = ${r} R`;
    case 'R-C': return `(${v} − 491.67) × 5/9 = ${r}°C`;
    case 'F-K': return `(${v} − 32) × 5/9 + 273.15 = ${r} K`;
    case 'K-F': return `(${v} − 273.15) × 9/5 + 32 = ${r}°F`;
    case 'F-R': return `${v} + 459.67 = ${r} R`;
    case 'R-F': return `${v} − 459.67 = ${r}°F`;
    case 'K-R': return `${v} × 9/5 = ${r} R`;
    case 'R-K': return `${v} × 5/9 = ${r} K`;
    default: return `${v}°${from} → ${r}°${to}`;
  }
}

const UNITS: { key: TempUnit; label: string; symbol: string }[] = [
  { key: 'C', label: 'Celsius', symbol: '°C' },
  { key: 'F', label: 'Fahrenheit', symbol: '°F' },
  { key: 'K', label: 'Kelvin', symbol: 'K' },
  { key: 'R', label: 'Rankine', symbol: 'R' },
];

function fmt(val: number): string {
  return parseFloat(val.toFixed(6)).toString();
}

export default function TemperatureConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<TempUnit>('C');
  const [copied, setCopied] = useState('');

  const { results, errorMsg } = React.useMemo(() => {
    const num = parseFloat(inputValue);
    if (inputValue === '' || isNaN(num)) return { results: null, errorMsg: '' };
    const celsius = toCelsius(num, fromUnit);
    if (celsius < -273.15) {
      return { results: null, errorMsg: 'Temperature cannot be below absolute zero (−273.15°C).' };
    }
    const results = UNITS.map(u => {
      const result = fromCelsius(celsius, u.key);
      return {
        unit: u.key,
        label: `${u.label} (${u.symbol})`,
        value: result,
        formula: getFormula(num, fromUnit, u.key, result),
      };
    });
    return { results, errorMsg: '' };
  }, [inputValue, fromUnit]);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const handleReset = () => {
    setInputValue('');
    setFromUnit('C');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Temperature Converter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter temperature"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Unit</label>
            <select
              value={fromUnit}
              onChange={e => setFromUnit(e.target.value as TempUnit)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {UNITS.map(u => (
                <option key={u.key} value={u.key}>{u.label} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMsg}</p>}

        <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">
          Reset
        </button>
      </div>

      {results && !errorMsg && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Conversion Results</h3>
          <div className="space-y-3">
            {results.map(row => (
              <div
                key={row.unit}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg border ${row.unit === fromUnit ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{row.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{row.formula}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-50">{fmt(row.value)}</span>
                  <button
                    onClick={() => handleCopy(fmt(row.value), row.unit)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2"
                  >
                    {copied === row.unit ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
