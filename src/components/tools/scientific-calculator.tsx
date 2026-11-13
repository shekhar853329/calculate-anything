import React, { useState, useCallback, useRef, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { Copy, Check, RotateCcw, CornerDownLeft } from 'lucide-react';

type ButtonDef = {
  label: string;
  value: string;
  type: 'num' | 'op' | 'fn' | 'clear' | 'equal';
};

const BUTTONS: ButtonDef[][] = [
  // Row 1
  [
    { label: 'sin', value: 'sin(', type: 'fn' },
    { label: 'cos', value: 'cos(', type: 'fn' },
    { label: 'tan', value: 'tan(', type: 'fn' },
    { label: '(', value: '(', type: 'fn' },
    { label: ')', value: ')', type: 'fn' },
    { label: 'C', value: 'C', type: 'clear' },
    { label: 'CE', value: 'CE', type: 'clear' },
  ],
  // Row 2
  [
    { label: 'ln', value: 'log(', type: 'fn' },
    { label: 'log', value: 'log10(', type: 'fn' },
    { label: '1/x', value: '1/(', type: 'fn' },
    { label: '7', value: '7', type: 'num' },
    { label: '8', value: '8', type: 'num' },
    { label: '9', value: '9', type: 'num' },
    { label: '÷', value: '/', type: 'op' },
  ],
  // Row 3
  [
    { label: 'x²', value: '^2', type: 'fn' },
    { label: 'xʸ', value: '^', type: 'fn' },
    { label: '√', value: 'sqrt(', type: 'fn' },
    { label: '4', value: '4', type: 'num' },
    { label: '5', value: '5', type: 'num' },
    { label: '6', value: '6', type: 'num' },
    { label: '×', value: '*', type: 'op' },
  ],
  // Row 4
  [
    { label: 'π', value: 'pi', type: 'fn' },
    { label: 'e', value: 'e', type: 'fn' },
    { label: '%', value: '/100', type: 'fn' },
    { label: '1', value: '1', type: 'num' },
    { label: '2', value: '2', type: 'num' },
    { label: '3', value: '3', type: 'num' },
    { label: '−', value: '-', type: 'op' },
  ],
  // Row 5
  [
    { label: '+/−', value: 'NEG', type: 'fn' },
    { label: 'abs', value: 'abs(', type: 'fn' },
    { label: '!', value: '!', type: 'fn' },
    { label: '0', value: '0', type: 'num' },
    { label: '.', value: '.', type: 'num' },
    { label: '=', value: '=', type: 'equal' },
    { label: '+', value: '+', type: 'op' },
  ],
];

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const calculate = useCallback(() => {
    if (!expression.trim()) return;
    try {
      const res = evaluate(expression);
      const formatted =
        typeof res === 'number'
          ? parseFloat(res.toPrecision(12)).toString()
          : String(res);
      setResult(formatted);
      setError('');
      setHistory(prev => [`${expression} = ${formatted}`, ...prev.slice(0, 7)]);
    } catch {
      setError('Invalid expression');
      setResult('');
    }
  }, [expression]);

  const handleButton = useCallback((value: string) => {
    setError('');
    if (value === '=') {
      calculate();
      return;
    }
    if (value === 'C') {
      setExpression('');
      setResult('');
      return;
    }
    if (value === 'CE') {
      setExpression(prev => prev.slice(0, -1));
      return;
    }
    if (value === 'NEG') {
      setExpression(prev => (prev ? `-(${prev})` : '-'));
      return;
    }
    setExpression(prev => prev + value);
}, [calculate]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
    }, [calculate]);

    const copyResult = useCallback(() => {
      const textToCopy = result || expression;
      if (!textToCopy) return;
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }, [result, expression]);

    return (
                <div className="space-y-3 max-w-2xl mx-auto">
                  {/* Unified Compact Screen Display */}
                  <div className="bg-gray-950 rounded-2xl p-3 sm:p-4 border border-gray-800 shadow-inner">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500">
                        Expression (Keyboard friendly)
                      </span>
                      <div className="flex items-center gap-2">
                        {(result || expression) && (
                          <button
                            onClick={copyResult}
                            className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors"
                            aria-label="Copy result"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>
            )}
                        {expression && (
                          <button
                            onClick={() => { setExpression(''); setResult(''); setError(''); }}
                            className="text-[11px] text-gray-400 hover:text-red-400 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Live Input Field */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={expression}
                      onChange={e => { setExpression(e.target.value); setError(''); }}
                      onKeyDown={handleKeyDown}
                      placeholder="0"
                      className="w-full bg-transparent text-right font-mono text-base sm:text-lg text-gray-300 placeholder-gray-600 focus:outline-none"
                    />

                    {/* Main Result Output */}
                    <div className={`text-right text-3xl sm:text-4xl font-mono font-extrabold tracking-tight truncate mt-0.5 ${error ? 'text-red-400' : 'text-white'}`}>
                      {error || result || (expression ? '' : '0')}
                    </div>
                  </div>

                  {/* 5-Row × 7-Column Calculator Button Matrix */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 select-none">
                    {BUTTONS.flat().map((btn, idx) => {
                      let style = '';

                      switch (btn.type) {
                        case 'num':
                          style =
                            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 shadow-xs text-xl sm:text-2xl font-bold';
                          break;
                        case 'op':
                          style =
                            'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-900/60 text-xl sm:text-2xl font-bold';
                          break;
                        case 'equal':
                          style =
                            'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 text-xl sm:text-2xl font-black';
                          break;
                        case 'clear':
                          style =
                            btn.label === 'C'
                              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900/60 text-base sm:text-lg font-bold'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900/60 text-base sm:text-lg font-bold';
                          break;
                        case 'fn':
                        default:
                          style =
                            'bg-gray-100/90 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750 border border-gray-200/80 dark:border-gray-700/80 text-xs sm:text-sm md:text-base font-semibold';
                          break;
                      }

                      return (
                        <button
                          key={`${btn.label}-${idx}`}
                          onClick={() => handleButton(btn.value)}
                          className={`h-11 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-100 active:scale-95 ${style}`}
                          aria-label={btn.label}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* History (Collapsible / Compact) */}
                  {history.length > 0 && (
                        <div className="bg-gray-50/80 dark:bg-gray-800/60 rounded-xl p-2.5 border border-gray-200/80 dark:border-gray-700/80">
                          <div className="flex justify-between items-center mb-1.5 px-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              Recent Calculations
                            </span>
                            <button
                              onClick={() => setHistory([])}
                              className="text-[11px] text-red-500 hover:text-red-600 transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="space-y-1">
            {
                                history.slice(0, 4).map((h, i) => (
                                  <div
                                    key={i}
                                    onClick={() => {
                                      const parts = h.split(' = ');
                                      if (parts[1]) {
                                        setExpression(parts[1]);
                                        setResult('');
                                      }
                                    }}
                                    className="text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate px-1 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    title="Click to reuse value"
                                  >
                                    {h}
                                  </div>
                                ))
                              }
          </div>
                        </div>
      )}
                      </div>
                      );
}
