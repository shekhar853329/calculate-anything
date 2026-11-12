import React, { useState, useCallback } from 'react';

type Mode = 'direct' | 'reverse';

interface PLResult {
  amount: number;
  percentage: number;
  margin: number;
  isProfit: boolean;
  sp?: number; // for reverse mode
}

export default function ProfitLossCalculator() {
  const [mode, setMode] = useState<Mode>('direct');

  // Direct: CP + SP
  const [cp, setCp] = useState('');
  const [sp, setSp] = useState('');

  // Reverse: CP + desired profit%
  const [rcP, setRcP] = useState('');
  const [desiredPct, setDesiredPct] = useState('');

  const [result, setResult] = useState<PLResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (mode === 'direct') {
      const cpVal = parseFloat(cp);
      const spVal = parseFloat(sp);
      if (isNaN(cpVal) || isNaN(spVal)) { setError('Please enter valid numbers for Cost Price and Selling Price.'); return; }
      if (cpVal <= 0) { setError('Cost Price must be greater than zero.'); return; }

      const diff = spVal - cpVal;
      const isProfit = diff >= 0;
      const amount = Math.abs(diff);
      const percentage = (amount / cpVal) * 100;
      const margin = spVal > 0 ? (amount / spVal) * 100 : 0;

      setResult({ amount, percentage, margin, isProfit });
    } else {
      const cpVal = parseFloat(rcP);
      const pct = parseFloat(desiredPct);
      if (isNaN(cpVal) || isNaN(pct)) { setError('Please enter valid values for Cost Price and desired profit %.'); return; }
      if (cpVal <= 0) { setError('Cost Price must be greater than zero.'); return; }

      const spVal = cpVal * (1 + pct / 100);
      const amount = Math.abs(spVal - cpVal);
      const margin = (amount / spVal) * 100;
      const isProfit = pct >= 0;

      setResult({ amount, percentage: Math.abs(pct), margin, isProfit, sp: spVal });
    }
  }, [mode, cp, sp, rcP, desiredPct]);

  const reset = useCallback(() => {
    setCp(''); setSp(''); setRcP(''); setDesiredPct('');
    setResult(null); setError(''); setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const lines = [
      `${result.isProfit ? 'Profit' : 'Loss'}: ${result.amount.toFixed(2)}`,
      `${result.isProfit ? 'Profit' : 'Loss'} %: ${result.percentage.toFixed(2)}%`,
      `Margin: ${result.margin.toFixed(2)}%`,
    ];
    if (result.sp !== undefined) lines.push(`Recommended Selling Price: ${result.sp.toFixed(2)}`);
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const tabs: { id: Mode; label: string }[] = [
    { id: 'direct', label: 'CP & SP → Profit/Loss' },
    { id: 'reverse', label: 'Find Selling Price' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setMode(tab.id); setError(''); setResult(null); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              mode === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mode === 'direct' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price (CP)</label>
              <input type="number" value={cp} onChange={e => setCp(e.target.value)} placeholder="e.g. 100"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (SP)</label>
              <input type="number" value={sp} onChange={e => setSp(e.target.value)} placeholder="e.g. 130"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        {mode === 'reverse' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price (CP)</label>
              <input type="number" value={rcP} onChange={e => setRcP(e.target.value)} placeholder="e.g. 100"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desired Profit % <span className="text-gray-400 font-normal">(use − for loss)</span></label>
              <input type="number" value={desiredPct} onChange={e => setDesiredPct(e.target.value)} placeholder="e.g. 20"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

      {result && (
        <div className="space-y-3">
          <div className={`rounded-xl p-5 ${result.isProfit ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
            <div className={`text-center text-3xl font-bold ${result.isProfit ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {result.isProfit ? '📈 Profit' : '📉 Loss'}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            {[
              { label: `${result.isProfit ? 'Profit' : 'Loss'} Amount`, value: result.amount.toFixed(2) },
              { label: `${result.isProfit ? 'Profit' : 'Loss'} Percentage`, value: `${result.percentage.toFixed(2)}%` },
              { label: 'Margin', value: `${result.margin.toFixed(2)}%` },
              ...(result.sp !== undefined ? [{ label: 'Recommended Selling Price', value: result.sp.toFixed(2) }] : []),
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className={`font-bold ${result.isProfit ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{item.value}</span>
              </div>
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
