import React, { useState } from 'react';

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

type TenureUnit = 'months' | 'years';

function formatCurrency(val: number): string {
  return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');
  const [showSchedule, setShowSchedule] = useState(false);

  interface EmiResult {
    emi: number;
    totalAmount: number;
    totalInterest: number;
    principalPct: number;
    interestPct: number;
    schedule: AmortizationRow[];
  }

  const { result, errorMsg } = React.useMemo((): { result: EmiResult | null; errorMsg: string } => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const t = parseFloat(tenure);

    if (isNaN(P) || P <= 0) return { result: null, errorMsg: principal ? 'Please enter a valid loan amount.' : '' };
    if (isNaN(annualRate) || annualRate < 0 || annualRate > 100) return { result: null, errorMsg: rate ? 'Please enter a valid annual interest rate (0–100).' : '' };
    if (isNaN(t) || t <= 0) return { result: null, errorMsg: tenure ? 'Please enter a valid tenure.' : '' };

    const N = tenureUnit === 'years' ? Math.round(t * 12) : Math.round(t);
    if (N < 1) return { result: null, errorMsg: 'Tenure must be at least 1 month.' };

    const monthlyRate = annualRate / 12 / 100;

    let emi: number;
    if (monthlyRate === 0) {
      emi = P / N;
    } else {
      emi = P * monthlyRate * Math.pow(1 + monthlyRate, N) / (Math.pow(1 + monthlyRate, N) - 1);
    }

    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;
    const principalPct = (P / totalAmount) * 100;
    const interestPct = (totalInterest / totalAmount) * 100;

    const schedule: AmortizationRow[] = [];
    let balance = P;
    for (let m = 1; m <= N; m++) {
      const interestPortion = balance * monthlyRate;
      const principalPortion = emi - interestPortion;
      balance = Math.max(0, balance - principalPortion);
      schedule.push({ month: m, emi, principal: principalPortion, interest: interestPortion, balance });
    }

    return { result: { emi, totalAmount, totalInterest, principalPct, interestPct, schedule }, errorMsg: '' };
  }, [principal, rate, tenure, tenureUnit]);

  const handleReset = () => {
    setPrincipal(''); setRate(''); setTenure('');
    setTenureUnit('years'); setShowSchedule(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Amount (₹)</label>
            <input
              type="number" min="0" value={principal} onChange={e => setPrincipal(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Interest Rate (%)</label>
            <input
              type="number" min="0" max="100" step="0.1" value={rate} onChange={e => setRate(e.target.value)}
              placeholder="e.g. 8.5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tenure</label>
            <div className="flex gap-2">
              <input
                type="number" min="1" value={tenure} onChange={e => setTenure(e.target.value)}
                placeholder={tenureUnit === 'years' ? 'e.g. 20' : 'e.g. 240'}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={tenureUnit}
                onChange={e => setTenureUnit(e.target.value as TenureUnit)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errorMsg}</p>}
        <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">Reset</button>
      </div>

      {result && !errorMsg && (
        <>
          {/* Summary */}
          <div className="bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{formatCurrency(result.emi)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount Payable</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{formatCurrency(result.totalAmount)}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            {/* Principal vs Interest bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Principal: {result.principalPct.toFixed(1)}%</span>
                <span>Interest: {result.interestPct.toFixed(1)}%</span>
              </div>
              <div className="flex h-5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 dark:bg-blue-600 transition-all"
                  style={{ width: `${result.principalPct}%` }}
                />
                <div
                  className="bg-orange-400 dark:bg-orange-500 transition-all"
                  style={{ width: `${result.interestPct}%` }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-500"></span> Principal</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-orange-400"></span> Interest</span>
              </div>
            </div>
          </div>

          {/* Amortization schedule */}
          <div className="bg-gray-50/70 dark:bg-gray-800/60 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Amortization Schedule</h3>
              <button
                onClick={() => setShowSchedule(s => !s)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showSchedule ? 'Hide' : 'Show'} Schedule
              </button>
            </div>
            {showSchedule && (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white dark:bg-gray-800">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-2 px-2 text-left text-gray-600 dark:text-gray-400">Month</th>
                      <th className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">EMI (₹)</th>
                      <th className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">Principal (₹)</th>
                      <th className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">Interest (₹)</th>
                      <th className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.month} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-1.5 px-2 text-gray-700 dark:text-gray-300">{row.month}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-gray-900 dark:text-gray-100">{formatCurrency(row.emi)}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-blue-600 dark:text-blue-400">{formatCurrency(row.principal)}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-orange-600 dark:text-orange-400">{formatCurrency(row.interest)}</td>
                        <td className="py-1.5 px-2 text-right font-mono text-gray-900 dark:text-gray-100">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
