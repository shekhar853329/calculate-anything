import { useState } from 'react';

export default function RdCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('5');

  const p = parseFloat(monthly);
  const r = parseFloat(rate) / 100 / 4;
  const n = parseFloat(years) * 4; // quarters
  const valid = p > 0 && r > 0 && n > 0;

  // RD formula: M = P × (1+r)^n – 1) / (1 – (1+r)^(-1/3))
  // Simplified quarterly: M = P × n × (1 + r * (n+1) / (2*12)) -- approximate
  // Exact RD maturity using quarterly compounding:
  const maturity = valid
    ? p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    : 0;
  const invested = valid ? p * parseFloat(years) * 12 : 0;
  const interest = maturity - invested;

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Deposit (₹)</label>
          <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Annual Interest Rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tenure (Years)</label>
          <input type="number" value={years} onChange={e => setYears(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>

      {valid && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(invested)}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Interest Earned</p>
            <p className="text-2xl font-bold text-green-600">₹{fmt(interest)}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Maturity Amount</p>
            <p className="text-2xl font-bold text-purple-600">₹{fmt(maturity)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
