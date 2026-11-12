import { useState } from 'react';

const FREQ_OPTIONS = [
  { label: 'Annually', value: 1 },
  { label: 'Semi-annually', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
];

export default function FdCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('3');
  const [freq, setFreq] = useState(4);

  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(years);
  const n = freq;
  const valid = p > 0 && r > 0 && t > 0;

  const maturity = valid ? p * Math.pow(1 + r / n, n * t) : 0;
  const interest = maturity - p;

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Principal Amount (₹)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)}
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
        <div>
          <label className="block text-sm font-medium mb-1">Compounding Frequency</label>
          <select value={freq} onChange={e => setFreq(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700">
            {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {valid && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Principal Amount</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(p)}</p>
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
