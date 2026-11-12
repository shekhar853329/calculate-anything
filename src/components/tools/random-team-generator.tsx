import { useState } from 'react';

const TEAM_COLORS = ['bg-blue-100 dark:bg-blue-900', 'bg-green-100 dark:bg-green-900', 'bg-purple-100 dark:bg-purple-900',
  'bg-orange-100 dark:bg-orange-900', 'bg-pink-100 dark:bg-pink-900', 'bg-teal-100 dark:bg-teal-900'];

export default function RandomTeamGenerator() {
  const [input, setInput] = useState('Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHank');
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  function generate() {
    const names = input.split('\n').map(s => s.trim()).filter(Boolean);
    if (names.length < numTeams) return;

    // Fisher-Yates shuffle
    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const result: string[][] = Array.from({ length: numTeams }, () => []);
    shuffled.forEach((name, i) => result[i % numTeams].push(name));
    setTeams(result);
  }

  const names = input.split('\n').filter(s => s.trim()).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Names (one per line)</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={8}
            className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
          <p className="text-xs text-gray-400 mt-1">{names} names</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Teams</label>
          <input type="number" min={2} max={names} value={numTeams}
            onChange={e => setNumTeams(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
          {names < numTeams && (
            <p className="text-xs text-red-500 mt-1">Not enough names for {numTeams} teams.</p>
          )}
        </div>
      </div>

      <button onClick={generate} disabled={names < numTeams}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium">
        Generate Teams
      </button>

      {teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, i) => (
            <div key={i} className={`rounded-xl p-4 ${TEAM_COLORS[i % TEAM_COLORS.length]}`}>
              <h3 className="font-bold mb-2">Team {i + 1} <span className="text-xs font-normal text-gray-500">({team.length} members)</span></h3>
              <ul className="space-y-1">
                {team.map(name => (
                  <li key={name} className="text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
