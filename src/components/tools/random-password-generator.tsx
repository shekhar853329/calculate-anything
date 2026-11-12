import { useState } from 'react';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function RandomPasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  function generate() {
    const pool = Object.entries(opts)
      .filter(([, v]) => v)
      .map(([k]) => CHARS[k as keyof typeof CHARS])
      .join('');
    if (!pool) return;

    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      let pwd = '';
      const arr = new Uint8Array(length);
      crypto.getRandomValues(arr);
      arr.forEach(byte => { pwd += pool[byte % pool.length]; });
      result.push(pwd);
    }
    setPasswords(result);
    setCopied(null);
  }

  function copy(pwd: string, i: number) {
    navigator.clipboard.writeText(pwd);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Length: {length}</label>
          <input type="range" min={4} max={128} value={length}
            onChange={e => setLength(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">How many: {count}</label>
          <input type="range" min={1} max={20} value={count}
            onChange={e => setCount(Number(e.target.value))} className="w-full accent-blue-500" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {(Object.keys(opts) as Array<keyof typeof opts>).map(k => (
          <label key={k} className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={opts[k]}
              onChange={e => setOpts(prev => ({ ...prev, [k]: e.target.checked }))}
              className="accent-blue-500" />
            <span className="capitalize">{k}</span>
            <span className="text-xs text-gray-400 font-mono">({CHARS[k].slice(0, 6)}…)</span>
          </label>
        ))}
      </div>

      <button onClick={generate}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
        Generate Passwords
      </button>

      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((pwd, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <span className="font-mono text-sm flex-1 break-all">{pwd}</span>
              <button onClick={() => copy(pwd, i)}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shrink-0">
                {copied === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
