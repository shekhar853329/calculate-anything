import React, { useState } from 'react';

type Mode = 'toRoman' | 'toArabic';

const ROMAN_TABLE: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

function arabicToRoman(n: number): { roman: string; steps: string[] } {
  const steps: string[] = [];
  let result = '';
  let rem = n;
  for (const [value, numeral] of ROMAN_TABLE) {
    while (rem >= value) {
      result += numeral;
      steps.push(`${rem} ÷ ${value} → add "${numeral}" (remaining: ${rem - value})`);
      rem -= value;
    }
  }
  return { roman: result, steps };
}

const ROMAN_VALUES: Record<string, number> = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
};

function romanToArabic(str: string): { arabic: number; steps: string[] } | null {
  const upper = str.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(upper)) return null;

  const steps: string[] = [];
  let result = 0;

  for (let i = 0; i < upper.length; i++) {
    const curr = ROMAN_VALUES[upper[i]];
    const next = ROMAN_VALUES[upper[i + 1]];
    if (next && curr < next) {
      steps.push(`${upper[i]} (${curr}) < ${upper[i + 1]} (${next}) → subtract: ${result} − ${curr} = ${result - curr}`);
      result -= curr;
    } else {
      steps.push(`${upper[i]} = ${curr} → add: ${result} + ${curr} = ${result + curr}`);
      result += curr;
    }
  }
  // Validate by converting back
  const { roman } = arabicToRoman(result);
  if (roman !== upper) return null;
  return { arabic: result, steps };
}

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<Mode>('toRoman');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (val: string) => {
    setInput(val);
    setError('');
  };

  let result: string | null = null;
  let steps: string[] = [];

  if (input.trim()) {
    if (mode === 'toRoman') {
      const num = parseInt(input, 10);
      if (isNaN(num) || !Number.isInteger(num)) {
        // Will show error on compute
      } else if (num < 1 || num > 3999) {
        setError('');
      } else {
        const out = arabicToRoman(num);
        result = out.roman;
        steps = out.steps;
      }
    } else {
      const out = romanToArabic(input.trim());
      if (out) {
        result = out.arabic.toString();
        steps = out.steps;
        if (out.arabic < 1 || out.arabic > 3999) {
          result = null;
        }
      }
    }
  }

  const validateAndGetError = (): string => {
    if (!input.trim()) return '';
    if (mode === 'toRoman') {
      const num = parseInt(input, 10);
      if (isNaN(num) || !Number.isInteger(parseFloat(input))) return 'Please enter a valid integer.';
      if (num < 1 || num > 3999) return 'Number must be between 1 and 3999.';
    } else {
      if (!/^[IVXLCDMivxlcdm]+$/.test(input.trim())) return 'Invalid Roman numeral. Use only I, V, X, L, C, D, M.';
      if (!romanToArabic(input.trim())) return 'Invalid Roman numeral format.';
      const out = romanToArabic(input.trim());
      if (out && (out.arabic < 1 || out.arabic > 3999)) return 'Result must be between 1 and 3999.';
    }
    return '';
  };

  const computedError = validateAndGetError();

  const handleReset = () => {
    setInput('');
    setError('');
  };

  const displayResult = computedError ? null : result;
  const displaySteps = computedError ? [] : steps;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Roman Numeral Converter</h2>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setMode('toRoman'); setInput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'toRoman' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            Arabic → Roman
          </button>
          <button
            onClick={() => { setMode('toArabic'); setInput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'toArabic' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            Roman → Arabic
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {mode === 'toRoman' ? 'Arabic Number (1–3999)' : 'Roman Numeral'}
          </label>
          <input
            type={mode === 'toRoman' ? 'number' : 'text'}
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={mode === 'toRoman' ? 'e.g. 2024' : 'e.g. MMXXIV'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {computedError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{computedError}</p>}
        <button onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">Reset</button>
      </div>

      {displayResult && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Result</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(displayResult);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{input.trim().toUpperCase()}</span>
            <span className="text-gray-400 dark:text-gray-500">→</span>
            <span className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">{displayResult}</span>
          </div>

          {displaySteps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Conversion Steps</h4>
              <ol className="space-y-1">
                {displaySteps.map((step, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                    <span className="text-gray-400 dark:text-gray-500 select-none">{i + 1}.</span>
                    <span className="font-mono">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
