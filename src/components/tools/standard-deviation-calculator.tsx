import React, { useState, useCallback } from 'react';

interface StdDevResult {
  mean: number;
  variance: number;
  popStdDev: number;
  sampleStdDev: number;
  count: number;
  nums: number[];
}

export default function StandardDeviationCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<StdDevResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (!input.trim()) { setError('Please enter at least two numbers.'); return; }

    const parts = input.split(/[,\s]+/).filter(Boolean);
    const nums: number[] = [];

    for (const p of parts) {
      const n = parseFloat(p);
      if (isNaN(n)) { setError(`"${p}" is not a valid number.`); return; }
      nums.push(n);
    }

    if (nums.length < 2) { setError('Please enter at least two numbers.'); return; }

    const count = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / count;
    const squaredDiffs = nums.map(n => (n - mean) ** 2);
    const sumSquaredDiffs = squaredDiffs.reduce((a, b) => a + b, 0);

    const variance = sumSquaredDiffs / count; // population variance
    const popStdDev = Math.sqrt(variance);
    const sampleStdDev = Math.sqrt(sumSquaredDiffs / (count - 1));

    setResult({ mean, variance, popStdDev, sampleStdDev, count, nums });
  }, [input]);

  const reset = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
    setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const fmt = (n: number) => parseFloat(n.toPrecision(10)).toString();
    const text = [
      `Count: ${result.count}`,
      `Mean: ${fmt(result.mean)}`,
      `Population Variance: ${fmt(result.variance)}`,
      `Population Std Dev (σ): ${fmt(result.popStdDev)}`,
      `Sample Std Dev (s): ${fmt(result.sampleStdDev)}`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const fmt = (n: number) => parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 8 });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Numbers <span className="text-gray-400 font-normal">(comma or space separated, min 2)</span>
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 10, 20, 30, 40, 50"
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{fmt(result.popStdDev)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Population Std Dev (σ)</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{fmt(result.sampleStdDev)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sample Std Dev (s)</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            {[
              { label: 'Count (n)', value: result.count },
              { label: 'Mean (x̄)', value: fmt(result.mean) },
              { label: 'Population Variance (σ²)', value: fmt(result.variance) },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className="font-medium font-mono text-gray-900 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
            <strong>Formula:</strong> σ = √(Σ(xᵢ − x̄)² / N) &nbsp;|&nbsp; s = √(Σ(xᵢ − x̄)² / (N−1))
          </div>

          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
