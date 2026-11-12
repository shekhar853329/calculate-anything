import { useState } from 'react';

function calcOldRegime(income: number, deductions: number): number {
  const taxable = Math.max(income - deductions, 0);
  if (taxable <= 250000) return 0;
  if (taxable <= 500000) return (taxable - 250000) * 0.05;
  if (taxable <= 1000000) return 12500 + (taxable - 500000) * 0.20;
  return 12500 + 100000 + (taxable - 1000000) * 0.30;
}

function calcNewRegime(income: number): number {
  const std = 50000;
  const taxable = Math.max(income - std, 0);
  if (taxable <= 300000) return 0;
  if (taxable <= 600000) return (taxable - 300000) * 0.05;
  if (taxable <= 900000) return 15000 + (taxable - 600000) * 0.10;
  if (taxable <= 1200000) return 15000 + 30000 + (taxable - 900000) * 0.15;
  if (taxable <= 1500000) return 15000 + 30000 + 45000 + (taxable - 1200000) * 0.20;
  return 15000 + 30000 + 45000 + 60000 + (taxable - 1500000) * 0.30;
}

function addSurcharge(tax: number, income: number): number {
  if (income > 10000000) return tax * 1.15;
  if (income > 5000000) return tax * 1.10;
  return tax;
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('150000');

  const inc = parseFloat(income);
  const ded = parseFloat(deductions) || 0;
  const valid = inc > 0;

  const oldTax = valid ? addSurcharge(calcOldRegime(inc, ded), inc) * 1.04 : 0;
  const newTax = valid ? addSurcharge(calcNewRegime(inc), inc) * 1.04 : 0;
  const better = oldTax <= newTax ? 'Old Regime' : 'New Regime';

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Annual Income (₹)</label>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)}
            placeholder="e.g. 1500000"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deductions under 80C (₹) <span className="text-xs text-gray-400">(Old Regime only)</span></label>
          <input type="number" value={deductions} onChange={e => setDeductions(e.target.value)}
            placeholder="e.g. 150000"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      </div>

      {valid && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className={`border rounded-xl p-5 ${better === 'Old Regime' ? 'border-green-400 bg-green-50 dark:bg-green-950' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'}`}>
              <p className="text-xs text-gray-500 mb-1">Old Regime Tax (incl. 4% cess)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(oldTax)}</p>
              {better === 'Old Regime' && <span className="text-xs text-green-600 font-medium">✓ Better for you</span>}
            </div>
            <div className={`border rounded-xl p-5 ${better === 'New Regime' ? 'border-green-400 bg-green-50 dark:bg-green-950' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'}`}>
              <p className="text-xs text-gray-500 mb-1">New Regime Tax (incl. 4% cess)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{fmt(newTax)}</p>
              {better === 'New Regime' && <span className="text-xs text-green-600 font-medium">✓ Better for you</span>}
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You save <strong>₹{fmt(Math.abs(oldTax - newTax))}</strong> by choosing the <strong>{better}</strong>.
            </p>
          </div>
          <p className="text-xs text-gray-400">* Based on FY 2024-25 slabs. Consult a tax professional for exact liability.</p>
        </>
      )}
    </div>
  );
}
