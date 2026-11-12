import { useState } from 'react';

export default function SipCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');

  const p = parseFloat(monthly);
  const r = parseFloat(rate) / 100 / 12;
  const n = parseFloat(years) * 12;
  const valid = p > 0 && r > 0 && n > 0;

  const maturity = valid ? p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : 0;
  const invested = valid ? p * n : 0;
  const returns = maturity - invested;

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const pct = maturity > 0 ? (returns / maturity) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Investment (₹)</label>
          <input
            type="number"
            value={monthly}
            onChange={e => setMonthly(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Return Rate (% p.a.)</label>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time Period (Years)</label>
          <input
            type="number"
            value={years}
            onChange={e => setYears(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      {valid && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(invested)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Estimated Returns</p>
              <p className="text-2xl font-bold text-green-600">₹{fmt(returns)}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Maturity Value</p>
              <p className="text-2xl font-bold text-purple-600">₹{fmt(maturity)}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Invested ({(100 - pct).toFixed(1)}%)</span>
              <span>Returns ({pct.toFixed(1)}%)</span>
            </div>
            <div className="h-4 w-full rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden flex">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${100 - pct}%` }}
              />
              <div
                className="h-full bg-green-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
