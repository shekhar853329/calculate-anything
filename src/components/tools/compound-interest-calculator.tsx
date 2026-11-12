import { useState } from 'react';

const FREQ_OPTIONS = [
  { label: 'Annually (n=1)', value: 1 },
  { label: 'Semi-annually (n=2)', value: 2 },
  { label: 'Quarterly (n=4)', value: 4 },
  { label: 'Monthly (n=12)', value: 12 },
  { label: 'Daily (n=365)', value: 365 },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [freq, setFreq] = useState(4);

  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(time);
  const n = freq;
  const valid = p > 0 && r > 0 && t > 0;

  const totalAmount = valid ? p * Math.pow(1 + r / n, n * t) : 0;
  const ci = totalAmount - p;

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Principal (P)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)}
            placeholder="e.g. 10000"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Annual Rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)}
            placeholder="e.g. 10"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time (Years)</label>
          <input type="number" value={time} onChange={e => setTime(e.target.value)}
            placeholder="e.g. 5"
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
        <>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
              A = P × (1 + r/n)^(n×t) = {p} × (1 + {(r/n).toFixed(6)})^{n * t}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Principal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(p)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Compound Interest</p>
              <p className="text-2xl font-bold text-green-600">₹{fmt(ci)}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">₹{fmt(totalAmount)}</p>
            </div>
          </div>
        </>
      )}

      <button onClick={() => { setPrincipal(''); setRate(''); setTime(''); }}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
        Reset
      </button>
    </div>
  );
}
