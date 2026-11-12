import { useState } from 'react';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const p = parseFloat(price);
  const d = parseFloat(discount);
  const valid = p > 0 && d >= 0 && d <= 100;

  const discountAmount = valid ? (p * d) / 100 : 0;
  const finalPrice = p - discountAmount;

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)}
            placeholder="e.g. 1000"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
            placeholder="e.g. 20" min="0" max="100"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>

      {valid && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">You Save</p>
            <p className="text-2xl font-bold text-red-500">₹{fmt(discountAmount)}</p>
            <p className="text-sm text-gray-500">({d}% off)</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Final Price</p>
            <p className="text-2xl font-bold text-green-600">₹{fmt(finalPrice)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-1">Original Price</p>
            <p className="text-2xl font-bold text-gray-500 line-through">₹{fmt(p)}</p>
          </div>
        </div>
      )}

      {d > 100 && (
        <p className="text-red-500 text-sm">Discount cannot exceed 100%.</p>
      )}

      <button onClick={() => { setPrice(''); setDiscount(''); }}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600">
        Reset
      </button>
    </div>
  );
}
