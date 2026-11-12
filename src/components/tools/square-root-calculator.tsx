import React, { useState, useCallback } from 'react';

interface RootResult {
  squareRoot: string;
  cubeRoot: string;
  nthRoot: string;
  steps: string[];
}

export default function SquareRootCalculator() {
  const [number, setNumber] = useState('');
  const [nthN, setNthN] = useState('4');
  const [result, setResult] = useState<RootResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    const num = parseFloat(number);
    if (isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }

    const n = parseInt(nthN, 10);
    if (isNaN(n) || n < 2) {
      setError('N must be an integer ≥ 2.');
      return;
    }

    const steps: string[] = [];

    // Square root
    let sqrtVal = '';
    if (num < 0) {
      sqrtVal = `${Math.sqrt(-num).toPrecision(10).replace(/\.?0+$/, '')}i (imaginary)`;
      steps.push(`√${num} = √(${-num}) × i = ${sqrtVal}`);
    } else {
      const sq = Math.sqrt(num);
      sqrtVal = sq.toPrecision(10).replace(/\.?0+$/, '');
      const sqInt = Math.floor(sq);
      steps.push(`√${num} = ${sqrtVal}`);
      if (Number.isInteger(sq)) steps.push(`${num} is a perfect square (${sq}² = ${num})`);
      else steps.push(`${sqInt}² = ${sqInt * sqInt} < ${num} < ${sqInt + 1}² = ${(sqInt + 1) * (sqInt + 1)}`);
    }

    // Cube root
    const cbSign = num < 0 ? -1 : 1;
    const cbVal = cbSign * Math.pow(Math.abs(num), 1 / 3);
    const cubeRoot = cbVal.toPrecision(10).replace(/\.?0+$/, '');
    steps.push(`∛${num} = ${cubeRoot}`);

    // Nth root
    let nthRoot = '';
    if (num < 0 && n % 2 === 0) {
      nthRoot = 'Not a real number (even root of negative)';
      steps.push(`${n}th root of ${num}: ${nthRoot}`);
    } else {
      const nthSign = num < 0 ? -1 : 1;
      const nthVal = nthSign * Math.pow(Math.abs(num), 1 / n);
      nthRoot = nthVal.toPrecision(10).replace(/\.?0+$/, '');
      steps.push(`${n}th root of ${num} = ${nthRoot}`);
    }

    setResult({ squareRoot: sqrtVal, cubeRoot, nthRoot, steps });
  }, [number, nthN]);

  const reset = useCallback(() => {
    setNumber(''); setNthN('4');
    setResult(null); setError(''); setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const text = `√${number} = ${result.squareRoot}\n∛${number} = ${result.cubeRoot}\n${nthN}th root of ${number} = ${result.nthRoot}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, number, nthN]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number</label>
            <input
              type="number"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="e.g. 144"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nth Root (N)</label>
            <input
              type="number"
              min="2"
              value={nthN}
              onChange={e => setNthN(e.target.value)}
              placeholder="e.g. 4"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: `√ (Square Root)`, value: result.squareRoot },
              { label: `∛ (Cube Root)`, value: result.cubeRoot },
              { label: `${nthN}th Root`, value: result.nthRoot },
            ].map(item => (
              <div key={item.label} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-purple-700 dark:text-purple-300 break-all">{item.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Step-by-step</div>
            <div className="space-y-1">
              {result.steps.map((step, i) => (
                <div key={i} className="text-sm font-mono text-gray-700 dark:text-gray-300">{step}</div>
              ))}
            </div>
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
