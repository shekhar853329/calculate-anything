import { useState } from 'react';

type Mode = 'exclusive' | 'inclusive';
const GST_RATES = [3, 5, 12, 18, 28];

export default function GstCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<Mode>('exclusive');

  const amt = parseFloat(amount);
  const valid = !isNaN(amt) && amt > 0;

  let baseAmount = 0, gstAmount = 0, totalAmount = 0;
  if (valid) {
    if (mode === 'exclusive') {
      baseAmount = amt;
      gstAmount = (amt * rate) / 100;
      totalAmount = amt + gstAmount;
    } else {
      totalAmount = amt;
      baseAmount = amt / (1 + rate / 100);
      gstAmount = totalAmount - baseAmount;
    }
  }

  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GST Rate (%)</label>
          <select
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          >
            {GST_RATES.map(r => (
              <option key={r} value={r}>{r}%</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Calculation Mode</label>
        <div className="flex gap-4">
          {(['exclusive', 'inclusive'] as Mode[]).map(m => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
                className="accent-blue-500"
              />
              <span className="capitalize">{m} of GST</span>
            </label>
          ))}
        </div>
      </div>

      {valid && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Base Amount</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹{fmt(baseAmount)}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">GST Amount ({rate}%)</p>
              <p className="text-xl font-bold text-green-600">₹{fmt(gstAmount)}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">₹{fmt(totalAmount)}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setAmount('')}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
      >
        Reset
      </button>
    </div>
  );
}
