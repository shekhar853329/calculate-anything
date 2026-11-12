import React, { useState, useCallback } from 'react';

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

type Mode = 'simplify' | 'missing' | 'scale';

export default function RatioCalculator() {
  const [mode, setMode] = useState<Mode>('simplify');

  // Simplify
  const [sA, setSA] = useState('');
  const [sB, setSB] = useState('');

  // Missing: A:B = C:?
  const [mA, setMA] = useState('');
  const [mB, setMB] = useState('');
  const [mC, setMC] = useState('');

  // Scale A:B by factor
  const [scA, setScA] = useState('');
  const [scB, setScB] = useState('');
  const [factor, setFactor] = useState('');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    setError('');
    setResult(null);

    if (mode === 'simplify') {
      const a = parseFloat(sA), b = parseFloat(sB);
      if (isNaN(a) || isNaN(b)) { setError('Enter valid numbers for A and B.'); return; }
      if (b === 0) { setError('B cannot be zero.'); return; }
      const g = gcd(a, b);
      setResult(`${a / g} : ${b / g}`);

    } else if (mode === 'missing') {
      const a = parseFloat(mA), b = parseFloat(mB), c = parseFloat(mC);
      if (isNaN(a) || isNaN(b) || isNaN(c)) { setError('Enter valid numbers for A, B, and C.'); return; }
      if (a === 0) { setError('A cannot be zero.'); return; }
      const d = (b * c) / a;
      setResult(`${mA} : ${mB} = ${mC} : ${parseFloat(d.toPrecision(10))}`);

    } else {
      const a = parseFloat(scA), b = parseFloat(scB), f = parseFloat(factor);
      if (isNaN(a) || isNaN(b) || isNaN(f)) { setError('Enter valid numbers for A, B, and scale factor.'); return; }
      setResult(`${parseFloat((a * f).toPrecision(10))} : ${parseFloat((b * f).toPrecision(10))}`);
    }
  }, [mode, sA, sB, mA, mB, mC, scA, scB, factor]);

  const reset = useCallback(() => {
    setSA(''); setSB(''); setMA(''); setMB(''); setMC('');
    setScA(''); setScB(''); setFactor('');
    setResult(null); setError(''); setCopied(false);
  }, []);

  const copy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const inputCls = "rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center w-24";

  const tabs: { id: Mode; label: string }[] = [
    { id: 'simplify', label: 'Simplify' },
    { id: 'missing', label: 'Find Missing' },
    { id: 'scale', label: 'Scale' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setMode(tab.id); setError(''); setResult(null); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              mode === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mode === 'simplify' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Simplify the ratio A : B</p>
            <div className="flex items-center gap-3">
              <input type="number" value={sA} onChange={e => setSA(e.target.value)} placeholder="A" className={inputCls} />
              <span className="text-xl font-bold text-gray-500">:</span>
              <input type="number" value={sB} onChange={e => setSB(e.target.value)} placeholder="B" className={inputCls} />
            </div>
          </div>
        )}

        {mode === 'missing' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Find missing value: A : B = C : ?</p>
            <div className="flex items-center gap-3 flex-wrap">
              <input type="number" value={mA} onChange={e => setMA(e.target.value)} placeholder="A" className={inputCls} />
              <span className="text-xl font-bold text-gray-500">:</span>
              <input type="number" value={mB} onChange={e => setMB(e.target.value)} placeholder="B" className={inputCls} />
              <span className="text-lg text-gray-500">=</span>
              <input type="number" value={mC} onChange={e => setMC(e.target.value)} placeholder="C" className={inputCls} />
              <span className="text-xl font-bold text-gray-500">: ?</span>
            </div>
          </div>
        )}

        {mode === 'scale' && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Scale ratio A : B by a factor</p>
            <div className="flex items-center gap-3 flex-wrap">
              <input type="number" value={scA} onChange={e => setScA(e.target.value)} placeholder="A" className={inputCls} />
              <span className="text-xl font-bold text-gray-500">:</span>
              <input type="number" value={scB} onChange={e => setScB(e.target.value)} placeholder="B" className={inputCls} />
              <span className="text-sm text-gray-500">× factor</span>
              <input type="number" value={factor} onChange={e => setFactor(e.target.value)} placeholder="×" className={inputCls} />
            </div>
          </div>
        )}

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
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-5 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{result}</div>
          </div>
          <button onClick={copy} className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copied ? '✓ Copied!' : 'Copy Result'}
          </button>
        </div>
      )}
    </div>
  );
}
