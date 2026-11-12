import { useState } from 'react';

export default function RandomNamePicker() {
  const [input, setInput] = useState('Alice\nBob\nCharlie\nDiana\nEve');
  const [winner, setWinner] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  function pick() {
    const names = input.split('\n').map(s => s.trim()).filter(Boolean);
    if (!names.length) return;
    setPicking(true);
    setWinner(null);

    let count = 0;
    const interval = setInterval(() => {
      setWinner(names[Math.floor(Math.random() * names.length)]);
      count++;
      if (count >= 15) {
        clearInterval(interval);
        setPicking(false);
      }
    }, 80);
  }

  const names = input.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Names (one per line)</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
        <p className="text-xs text-gray-400 mt-1">{names.length} names</p>
      </div>

      <button
        onClick={pick}
        disabled={names.length < 2 || picking}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-semibold text-lg"
      >
        {picking ? 'Picking…' : '🎲 Pick Random Winner'}
      </button>

      {winner && (
        <div className={`text-center rounded-2xl p-8 border-2 transition-all ${picking ? 'border-blue-300 bg-blue-50 dark:bg-blue-950' : 'border-green-400 bg-green-50 dark:bg-green-950'}`}>
          <p className="text-sm text-gray-500 mb-2">Winner</p>
          <p className={`text-4xl font-bold ${picking ? 'text-blue-600' : 'text-green-600'}`}>{winner}</p>
          {!picking && <p className="mt-2 text-green-500 text-sm">🎉 Congratulations!</p>}
        </div>
      )}
    </div>
  );
}
