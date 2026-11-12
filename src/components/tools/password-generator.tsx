import React, { useState, useCallback, useMemo } from 'react';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = /[0O1lI]/g;

function generatePassword(length: number, useUpper: boolean, useLower: boolean, useNumbers: boolean, useSymbols: boolean, excludeAmbiguous: boolean): string {
  let chars = '';
  if (useUpper) chars += UPPERCASE;
  if (useLower) chars += LOWERCASE;
  if (useNumbers) chars += NUMBERS;
  if (useSymbols) chars += SYMBOLS;
  if (excludeAmbiguous) chars = chars.replace(AMBIGUOUS, '');
  if (!chars) return '';

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(v => chars[v % chars.length]).join('');
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: score / 7, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score: score / 7, label: 'Fair', color: 'bg-yellow-500' };
  if (score <= 6) return { score: score / 7, label: 'Strong', color: 'bg-blue-500' };
  return { score: 1, label: 'Very Strong', color: 'bg-green-500' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous));
    }
    setPasswords(list);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, count]);

  const strength = useMemo(() => getStrength(passwords[0] || ''), [passwords]);

  const copyOne = (idx: number) => {
    navigator.clipboard.writeText(passwords[idx]).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(passwords.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const options = [
    { label: 'Uppercase (A-Z)', value: useUpper, set: setUseUpper },
    { label: 'Lowercase (a-z)', value: useLower, set: setUseLower },
    { label: 'Numbers (0-9)', value: useNumbers, set: setUseNumbers },
    { label: 'Symbols (!@#...)', value: useSymbols, set: setUseSymbols },
    { label: 'Exclude ambiguous (0,O,1,l)', value: excludeAmbiguous, set: setExcludeAmbiguous },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Length: {length}</label>
        <input type="range" min={8} max={128} value={length} onChange={e => setLength(Number(e.target.value))}
          className="w-full accent-blue-600" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span>8</span><span>128</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(opt => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={opt.value} onChange={e => opt.set(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generate Count (1–20)</label>
        <input type="number" min={1} max={20} value={count} onChange={e => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
          className="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
          Generate
        </button>
        {passwords.length > 1 && (
          <button onClick={copyAll} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copiedAll ? '✓ Copied All' : 'Copy All'}
          </button>
        )}
      </div>

      {passwords.length > 0 && (
        <div className="space-y-3">
          {passwords.length === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all`}
                    style={{ width: `${strength.score * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{strength.label}</span>
              </div>
            </div>
          )}
          <div className="rounded-lg border border-gray-300 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-700">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 gap-3">
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all flex-1">{pw}</code>
                <button onClick={() => copyOne(i)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0">
                  {copiedIdx === i ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
