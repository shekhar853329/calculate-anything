import React, { useState, useCallback } from 'react';

function factorial(n: number): bigint {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result;
}

export default function FactorialCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ value: string; scientific: string; digits: number } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    const n = parseInt(input, 10);
    if (isNaN(n) || !Number.isInteger(n)) {
      setError('Please enter a non-negative integer.');
      return;
    }
    if (n < 0) {
      setError('Factorial is not defined for negative numbers.');
      return;
    }
    if (n > 170) {
      setError('Please enter a number ≤ 170 (above that, the result exceeds double precision).');
      return;
    }

    const bigVal = factorial(n);
    const valStr = bigVal.toString();
    const digits = valStr.length;

    // Scientific notation via floating point
    const floatVal = Number(bigVal);
    const scientific = floatVal.toExponential(6);

    setResult({ value: valStr, scientific, digits });
  }, [input]);

  const reset = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(`${input}! = ${result.value}\n≈ ${result.scientific}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, input]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Number <span className="text-gray-400 font-normal">(0 – 170)</span>
          </label>
          <input
            type="number"
            min="0"
            max="170"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 10"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && calculate()}
          />
        </div>

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
          <div className="bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Scientific notation</span>
              <span className="font-mono font-bold text-violet-700 dark:text-violet-300">{result.scientific}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Number of digits</span>
              <span className="font-bold text-violet-700 dark:text-violet-300">{result.digits}</span>
            </div>
          </div>

          {result.digits <= 60 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{input}! =</div>
              <div className="font-mono text-gray-900 dark:text-gray-100 break-all text-sm">{result.value}</div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">First 50 digits...</div>
              <div className="font-mono text-gray-900 dark:text-gray-100 text-sm break-all">
                {result.value.slice(0, 50)}...
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">(Full value has {result.digits} digits)</div>
            </div>
          )}

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
