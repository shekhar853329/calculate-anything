import React, { useState, useCallback } from 'react';

type Mode = 'whatIs' | 'xOfY' | 'change';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('whatIs');

  // Mode 1: What is X% of Y?
  const [pct1, setPct1] = useState('');
  const [val1, setVal1] = useState('');
  const [res1, setRes1] = useState<string | null>(null);

  // Mode 2: X is what % of Y?
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [res2, setRes2] = useState<string | null>(null);

  // Mode 3: Percentage change from X to Y
  const [from3, setFrom3] = useState('');
  const [to3, setTo3] = useState('');
  const [res3, setRes3] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const reset = useCallback(() => {
    setPct1(''); setVal1(''); setRes1(null);
    setNum2(''); setDen2(''); setRes2(null);
    setFrom3(''); setTo3(''); setRes3(null);
    setError(''); setCopied(false);
  }, []);

  const calculate = useCallback(() => {
    setError('');

    if (mode === 'whatIs') {
      const p = parseFloat(pct1), v = parseFloat(val1);
      if (isNaN(p) || isNaN(v)) { setError('Please enter valid numbers.'); return; }
      setRes1(((p / 100) * v).toLocaleString(undefined, { maximumFractionDigits: 10 }));

    } else if (mode === 'xOfY') {
      const n = parseFloat(num2), d = parseFloat(den2);
      if (isNaN(n) || isNaN(d)) { setError('Please enter valid numbers.'); return; }
      if (d === 0) { setError('Denominator cannot be zero.'); return; }
      setRes2(((n / d) * 100).toLocaleString(undefined, { maximumFractionDigits: 6 }) + '%');

    } else {
      const f = parseFloat(from3), t = parseFloat(to3);
      if (isNaN(f) || isNaN(t)) { setError('Please enter valid numbers.'); return; }
      if (f === 0) { setError('Starting value cannot be zero.'); return; }
      const change = ((t - f) / Math.abs(f)) * 100;
      const sign = change >= 0 ? '+' : '';
      setRes3(`${sign}${change.toLocaleString(undefined, { maximumFractionDigits: 6 })}%`);
    }
  }, [mode, pct1, val1, num2, den2, from3, to3]);

  const currentResult = mode === 'whatIs' ? res1 : mode === 'xOfY' ? res2 : res3;

  const copy = useCallback(() => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentResult]);

  const tabs: { id: Mode; label: string }[] = [
    { id: 'whatIs', label: 'X% of Y' },
    { id: 'xOfY', label: 'X is ?% of Y' },
    { id: 'change', label: '% Change' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setMode(tab.id); setError(''); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              mode === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mode === 'whatIs' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">What is <strong>X%</strong> of <strong>Y</strong>?</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Percentage (X)</label>
                <input type="number" value={pct1} onChange={e => setPct1(e.target.value)} placeholder="e.g. 15"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Value (Y)</label>
                <input type="number" value={val1} onChange={e => setVal1(e.target.value)} placeholder="e.g. 200"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        )}

        {mode === 'xOfY' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>X</strong> is what percent of <strong>Y</strong>?</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Number (X)</label>
                <input type="number" value={num2} onChange={e => setNum2(e.target.value)} placeholder="e.g. 30"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Total (Y)</label>
                <input type="number" value={den2} onChange={e => setDen2(e.target.value)} placeholder="e.g. 200"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        )}

        {mode === 'change' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Percentage change from <strong>X</strong> to <strong>Y</strong></p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From (X)</label>
                <input type="number" value={from3} onChange={e => setFrom3(e.target.value)} placeholder="e.g. 100"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To (Y)</label>
                <input type="number" value={to3} onChange={e => setTo3(e.target.value)} placeholder="e.g. 150"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
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

      {currentResult && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-5 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{currentResult}</div>
          </div>
          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
