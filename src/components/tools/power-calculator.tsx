import React, { useState, useCallback } from 'react';

export default function PowerCalculator() {
  const [base, setBase] = useState('');
  const [exponent, setExponent] = useState('');
  const [result, setResult] = useState<{ value: string; scientific: string; steps: string[] } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    const b = parseFloat(base);
    const e = parseFloat(exponent);

    if (isNaN(b) || isNaN(e)) {
      setError('Please enter valid numbers for base and exponent.');
      return;
    }

    if (b === 0 && e < 0) {
      setError('Zero cannot be raised to a negative exponent.');
      return;
    }

    const val = Math.pow(b, e);
    if (!isFinite(val)) {
      setError('Result is too large or undefined.');
      return;
    }

    const steps: string[] = [];
    steps.push(`${b}^${e} = ?`);

    if (Number.isInteger(e) && e >= 0 && e <= 5) {
      if (e === 0) steps.push(`Any number^0 = 1`);
      else {
        const mult = Array(e).fill(b).join(' × ');
        steps.push(`= ${mult}`);
      }
    }

    const formatted = Math.abs(val) >= 1e15 || (Math.abs(val) < 1e-6 && val !== 0)
      ? val.toExponential(6)
      : parseFloat(val.toPrecision(14)).toString();

    const scientific = val.toExponential(6);

    steps.push(`= ${formatted}`);
    if (formatted !== scientific) steps.push(`Scientific notation: ${scientific}`);

    setResult({ value: formatted, scientific, steps });
  }, [base, exponent]);

  const reset = useCallback(() => {
    setBase(''); setExponent('');
    setResult(null); setError(''); setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(`${base}^${exponent} = ${result.value}\nScientific: ${result.scientific}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, base, exponent]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base</label>
            <input
              type="number"
              value={base}
              onChange={e => setBase(e.target.value)}
              placeholder="e.g. 2"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exponent</label>
            <input
              type="number"
              value={exponent}
              onChange={e => setExponent(e.target.value)}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {base && exponent && (
          <div className="text-center text-lg font-mono text-gray-600 dark:text-gray-400">
            {base}<sup>{exponent}</sup> = ?
          </div>
        )}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Calculate
          </button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-5 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</div>
            <div className="text-2xl font-bold font-mono text-orange-700 dark:text-orange-300 break-all">{result.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">{result.scientific}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Steps</div>
            {result.steps.map((step, i) => (
              <div key={i} className="text-sm font-mono text-gray-700 dark:text-gray-300">{step}</div>
            ))}
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
