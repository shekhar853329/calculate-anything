import { useState } from 'react';

const OPTIONS = ['Yes', 'No', 'Maybe', 'Definitely!', 'Absolutely Not', 'Ask Later'];
const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export default function DecisionMaker() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [question, setQuestion] = useState('');

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const extra = 1440 + Math.random() * 1440;
    const newRot = rotation + extra;
    setRotation(newRot);

    setTimeout(() => {
      const normalised = newRot % 360;
      const segSize = 360 / OPTIONS.length;
      const idx = Math.floor(((360 - normalised) % 360) / segSize) % OPTIONS.length;
      setResult(OPTIONS[idx]);
      setSpinning(false);
    }, 3000);
  }

  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  function segPath(i: number) {
    const total = OPTIONS.length;
    const start = (i / total) * 2 * Math.PI - Math.PI / 2;
    const end = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
  }

  function labelPos(i: number) {
    const total = OPTIONS.length;
    const angle = ((i + 0.5) / total) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + (r * 0.65) * Math.cos(angle), y: cy + (r * 0.65) * Math.sin(angle) };
  }

  return (
    <div className="space-y-6 text-center">
      <div>
        <label className="block text-sm font-medium mb-1 text-left">Your Question (optional)</label>
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="Should I…?"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
      </div>

      {question && <p className="text-gray-600 dark:text-gray-400 italic">"{question}"</p>}

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 text-2xl">▼</div>
          <svg
            width={size}
            height={size}
            style={{ transition: spinning ? 'transform 3s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none',
              transform: `rotate(${rotation}deg)` }}
          >
            {OPTIONS.map((opt, i) => {
              const pos = labelPos(i);
              return (
                <g key={i}>
                  <path d={segPath(i)} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth={2} />
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize={11} fontWeight="bold"
                    transform={`rotate(${((i + 0.5) / OPTIONS.length) * 360 - 90}, ${pos.x}, ${pos.y})`}>
                    {opt}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={12} fill="white" stroke="#999" strokeWidth={2} />
          </svg>
        </div>

        <button onClick={spin} disabled={spinning}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-bold text-lg">
          {spinning ? 'Spinning…' : '🎯 Spin!'}
        </button>
      </div>

      {result && !spinning && (
        <div className="bg-green-50 dark:bg-green-950 border-2 border-green-400 rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-1">The answer is:</p>
          <p className="text-4xl font-bold text-green-600">{result}</p>
        </div>
      )}
    </div>
  );
}
