import { useState } from 'react';

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState('');

  const annual = parseFloat(ctc);
  const valid = annual > 0;

  // Breakdown
  const basic = annual * 0.5;
  const hra = basic * 0.4;
  const special = annual - basic - hra - (annual * 0.12) - (annual * 0.12) - 2400;
  const employerPf = basic * 0.12;
  const employeePf = basic * 0.12;
  const professionalTax = 2400; // ₹200/month
  const grossMonthly = (basic + hra + Math.max(special, 0)) / 12;
  const deductions = (employeePf + professionalTax) / 12;
  const takeHome = grossMonthly - deductions;

  const fmt = (v: number) =>
    v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows = [
    { label: 'Basic Salary (50% of CTC)', value: basic / 12, type: 'earning' },
    { label: 'HRA (40% of Basic)', value: hra / 12, type: 'earning' },
    { label: 'Special Allowance', value: Math.max(special, 0) / 12, type: 'earning' },
    { label: 'Employee PF (12% of Basic)', value: -employeePf / 12, type: 'deduction' },
    { label: 'Professional Tax', value: -professionalTax / 12, type: 'deduction' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Annual CTC (₹)</label>
        <input type="number" value={ctc} onChange={e => setCtc(e.target.value)}
          placeholder="e.g. 1200000"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        <p className="text-xs text-gray-500 mt-1">Cost To Company (annual package)</p>
      </div>

      {valid && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left px-4 py-2 rounded-tl-lg">Component</th>
                  <th className="text-right px-4 py-2">Monthly (₹)</th>
                  <th className="text-right px-4 py-2 rounded-tr-lg">Annual (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.label} className="border-t dark:border-gray-700">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className={`text-right px-4 py-2 ${row.type === 'deduction' ? 'text-red-500' : 'text-green-600'}`}>
                      {row.type === 'deduction' ? '-' : ''}₹{fmt(Math.abs(row.value))}
                    </td>
                    <td className={`text-right px-4 py-2 ${row.type === 'deduction' ? 'text-red-500' : 'text-green-600'}`}>
                      {row.type === 'deduction' ? '-' : ''}₹{fmt(Math.abs(row.value) * 12)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-blue-400 font-bold bg-blue-50 dark:bg-blue-950">
                  <td className="px-4 py-3">In-Hand Salary</td>
                  <td className="text-right px-4 py-3 text-blue-600">₹{fmt(takeHome)}</td>
                  <td className="text-right px-4 py-3 text-blue-600">₹{fmt(takeHome * 12)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-gray-400">* Estimates only. Actual salary depends on employer structure and applicable tax.</p>
        </div>
      )}
    </div>
  );
}
