import React, { useState, useCallback } from 'react';
import { evaluate } from 'mathjs';

type ButtonDef = { label: string; value: string; className?: string };

const BUTTONS: ButtonDef[][] = [
  [
    { label: 'C', value: 'C', className: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60' },
    { label: 'CE', value: 'CE', className: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
  ],
  [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log10(' },
  ],
  [
    { label: 'ln', value: 'log(' },
    { label: '√', value: 'sqrt(' },
    { label: 'x²', value: '^2' },
    { label: 'xʸ', value: '^' },
  ],
  [
    { label: '1/x', value: '1/(' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: '%', value: '/100' },
  ],
  [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '÷', value: '/' },
  ],
  [
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '×', value: '*' },
  ],
  [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '−', value: '-' },
  ],
  [
    { label: '+/−', value: 'NEG' },
    { label: '0', value: '0' },
    { label: '.', value: '.' },
    { label: '+', value: '+' },
  ],
];

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleButton = useCallback((value: string) => {
    setError('');
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
      setExpression(prev => prev ? `-(${prev})` : '');
      return;
    }
    setExpression(prev => prev + value);
  }, []);

  const calculate = useCallback(() => {
    if (!expression.trim()) return;
    try {
      const res = evaluate(expression);
      const formatted = typeof res === 'number' ? parseFloat(res.toPrecision(12)).toString() : String(res);
      setResult(formatted);
      setError('');
      setHistory(prev => [`${expression} = ${formatted}`, ...prev.slice(0, 9)]);
    } catch {
      setError('Invalid expression');
      setResult('');
    }
  }, [expression]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  }, [calculate]);

  return (
    <div className="space-y-4">
      {/* Display */}
      <div className="bg-gray-900 dark:bg-black rounded-xl p-4 space-y-1">
        <div className="text-gray-400 text-sm font-mono min-h-5 truncate">{expression || '0'}</div>
        <div className={`text-3xl font-mono font-bold truncate ${error ? 'text-red-400' : 'text-white'}`}>
          {error || result || '0'}
        </div>
      </div>

      {/* Expression input (keyboard friendly) */}
      <input
        type="text"
        value={expression}
        onChange={e => { setExpression(e.target.value); setError(''); }}
        onKeyDown={handleKeyDown}
        placeholder="Type expression or use buttons below"
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Buttons */}
      <div className="space-y-1.5">
        {BUTTONS.map((row, ri) => (
          <div key={ri} className="grid grid-cols-4 gap-1.5">
            {row.map(btn => (
              <button
                key={btn.label}
                onClick={() => handleButton(btn.value)}
                className={`py-3 rounded-lg font-medium text-sm transition-colors ${btn.className ?? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}
        <button
          onClick={calculate}
          className="w-full py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors"
        >
          =
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">History</span>
            <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-600">Clear</button>
          </div>
          <div className="space-y-1">
            {history.map((h, i) => (
              <div key={i} className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate">{h}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
