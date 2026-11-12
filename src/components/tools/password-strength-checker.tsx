import { useState } from 'react';

function getStrength(pwd: string): { score: number; label: string; color: string; tips: string[] } {
  if (!pwd) return { score: 0, label: '', color: 'bg-gray-200', tips: [] };
  let score = 0;
  const tips: string[] = [];

  if (pwd.length >= 8) score += 1; else tips.push('Use at least 8 characters');
  if (pwd.length >= 12) score += 1; else if (pwd.length >= 8) tips.push('12+ characters is better');
  if (pwd.length >= 16) score += 1;
  if (/[a-z]/.test(pwd)) score += 1; else tips.push('Add lowercase letters (a-z)');
  if (/[A-Z]/.test(pwd)) score += 1; else tips.push('Add uppercase letters (A-Z)');
  if (/[0-9]/.test(pwd)) score += 1; else tips.push('Add numbers (0-9)');
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1; else tips.push('Add special characters (!@#$…)');
  if (!/(.)\1{2,}/.test(pwd)) score += 1; else tips.push('Avoid repeated characters (aaa, 111)');
  if (!/^(?:password|123456|qwerty|abc123|letmein)/i.test(pwd)) score += 1;
    else tips.push('Avoid common patterns');

  const levels = [
    { min: 0, label: 'Very Weak', color: 'bg-red-500' },
    { min: 3, label: 'Weak', color: 'bg-orange-500' },
    { min: 5, label: 'Fair', color: 'bg-yellow-500' },
    { min: 7, label: 'Good', color: 'bg-blue-500' },
    { min: 9, label: 'Strong', color: 'bg-green-500' },
  ];

  const level = [...levels].reverse().find(l => score >= l.min) || levels[0];
  return { score, label: level.label, color: level.color, tips };
}

export default function PasswordStrengthChecker() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const { score, label, color, tips } = getStrength(pwd);
  const pct = Math.round((score / 9) * 100);

  const checks = [
    { label: '8+ characters', ok: pwd.length >= 8 },
    { label: '12+ characters', ok: pwd.length >= 12 },
    { label: 'Lowercase (a-z)', ok: /[a-z]/.test(pwd) },
    { label: 'Uppercase (A-Z)', ok: /[A-Z]/.test(pwd) },
    { label: 'Numbers (0-9)', ok: /[0-9]/.test(pwd) },
    { label: 'Special chars', ok: /[^a-zA-Z0-9]/.test(pwd) },
    { label: 'No repeated chars', ok: !(/(.)\1{2,}/.test(pwd)) },
  ];

  return (
    <div className="space-y-5">
      <div className="relative">
        <label className="block text-sm font-medium mb-1">Enter Password</label>
        <input
          type={show ? 'text' : 'password'}
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder="Type a password to check its strength…"
          className="w-full border rounded-lg px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 font-mono"
        />
        <button onClick={() => setShow(s => !s)}
          className="absolute right-3 top-8 text-xs text-blue-500 hover:text-blue-700">
          {show ? 'Hide' : 'Show'}
        </button>
      </div>

      {pwd && (
        <>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span className="text-gray-400">{score}/9</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${color}`}
                style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {checks.map(c => (
              <div key={c.label}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${c.ok ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                <span>{c.ok ? '✓' : '○'}</span>
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          {tips.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Suggestions:</p>
              <ul className="space-y-1">
                {tips.map((tip, i) => (
                  <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
