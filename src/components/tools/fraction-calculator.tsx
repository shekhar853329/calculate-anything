import React, { useState, useCallback } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(Math.abs(num), Math.abs(den));
  let n = num / g, d = den / g;
  if (d < 0) { n = -n; d = -d; }
  return [n, d];
}

type Op = '+' | '-' | '*' | '/';

interface FracResult {
  num: number;
  den: number;
  decimal: string;
}

export default function FractionCalculator() {
  const [n1, setN1] = useState('');
  const [d1, setD1] = useState('');
  const [op, setOp] = useState<Op>('+');
  const [n2, setN2] = useState('');
  const [d2, setD2] = useState('');
  const [result, setResult] = useState<FracResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    const a = parseInt(n1, 10), b = parseInt(d1, 10);
    const c = parseInt(n2, 10), d = parseInt(d2, 10);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      setError('Please fill in all four fields with integers.');
      return;
    }
    if (b === 0 || d === 0) {
      setError('Denominators cannot be zero.');
      return;
    }

    let rn: number, rd: number;

    switch (op) {
      case '+': rn = a * d + c * b; rd = b * d; break;
      case '-': rn = a * d - c * b; rd = b * d; break;
      case '*': rn = a * c; rd = b * d; break;
      case '/':
        if (c === 0) { setError('Cannot divide by zero fraction.'); return; }
        rn = a * d; rd = b * c; break;
      default: return;
    }

    const [sn, sd] = simplify(rn, rd);
    const decimal = sd === 0 ? 'undefined' : (sn / sd).toPrecision(10).replace(/\.?0+$/, '');

    setResult({ num: sn, den: sd, decimal });
  }, [n1, d1, op, n2, d2]);

  const reset = useCallback(() => {
    setN1(''); setD1(''); setN2(''); setD2('');
    setOp('+'); setResult(null); setError(''); setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    const text = `${result.num}/${result.den} = ${result.decimal}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const inputCls = "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center gap-1 w-20">
            <input type="number" value={n1} onChange={e => setN1(e.target.value)} placeholder="num" className={inputCls} />
            <div className="w-full h-px bg-gray-400 dark:bg-gray-500" />
            <input type="number" value={d1} onChange={e => setD1(e.target.value)} placeholder="den" className={inputCls} />
          </div>

          {/* Operator */}
          <select
            value={op}
            onChange={e => setOp(e.target.value as Op)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">/</option>
          </select>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center gap-1 w-20">
            <input type="number" value={n2} onChange={e => setN2(e.target.value)} placeholder="num" className={inputCls} />
            <div className="w-full h-px bg-gray-400 dark:bg-gray-500" />
            <input type="number" value={d2} onChange={e => setD2(e.target.value)} placeholder="den" className={inputCls} />
          </div>

          <div className="flex items-center text-2xl font-bold text-gray-500 dark:text-gray-400">=</div>

          {/* Result */}
          {result && (
            <div className="flex flex-col items-center gap-1 w-24">
              <div className="font-mono text-center text-blue-700 dark:text-blue-300 text-lg font-bold">{result.num}</div>
              <div className="w-full h-px bg-blue-400 dark:bg-blue-500" />
              <div className="font-mono text-center text-blue-700 dark:text-blue-300 text-lg font-bold">{result.den}</div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            Calculate
          </button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Simplified fraction</span>
              <span className="font-bold font-mono text-blue-700 dark:text-blue-300">{result.num}/{result.den}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Decimal</span>
              <span className="font-bold font-mono text-blue-700 dark:text-blue-300">{result.decimal}</span>
            </div>
          </div>
          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
