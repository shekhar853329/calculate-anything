import { useState } from 'react';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const t = parseFloat(time);
  const valid = p > 0 && r > 0 && t > 0;

  const si = valid ? (p * r * t) / 100 : 0;
  const total = p + si;

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Principal (P)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)}
            placeholder="e.g. 10000"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rate of Interest (% p.a.)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)}
            placeholder="e.g. 8"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time (Years)</label>
          <input type="number" value={time} onChange={e => setTime(e.target.value)}
            placeholder="e.g. 3"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>

      {valid && (
        <>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-2">
            <p className="text-sm text-gray-500 font-mono">
              SI = (P × R × T) / 100 = ({p} × {r} × {t}) / 100
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Simple Interest</p>
              <p className="text-2xl font-bold text-green-600">₹{fmt(si)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">₹{fmt(total)}</p>
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
