import { useState, useRef } from 'react';
import { Play, Pause, Flag, RotateCcw } from 'lucide-react';

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${h > 0 ? String(h).padStart(2,'0') + ':' : ''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<{ n: number; time: number; split: number }[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const rafRef = useRef<number>(0);

  function tick() {
    setElapsed(baseRef.current + (Date.now() - startRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }

  function start() {
    startRef.current = Date.now();
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(rafRef.current);
    baseRef.current += Date.now() - startRef.current;
    setRunning(false);
  }

  function reset() {
    cancelAnimationFrame(rafRef.current);
    setElapsed(0);
    baseRef.current = 0;
    setRunning(false);
    setLaps([]);
  }

  function lap() {
    const current = baseRef.current + (Date.now() - startRef.current);
    const prev = laps.length > 0 ? laps[laps.length - 1].time : 0;
    setLaps(l => [...l, { n: l.length + 1, time: current, split: current - prev }]);
  }

  return (
    <div className="space-y-8 text-center max-w-xl mx-auto py-4">
      {/* Timer Display */}
      <div className="p-8 rounded-3xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 shadow-inner">
        <div className="text-5xl sm:text-7xl font-mono font-bold tracking-tight text-blue-600 dark:text-blue-400 select-all">
          {fmt(elapsed)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
        {!running ? (
          <button
            onClick={start}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            {elapsed === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
          >
            <Pause className="w-4 h-4 fill-white" />
            Pause
          </button>
        )}
        <button
          onClick={lap}
          disabled={!running}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900/50 text-white rounded-xl font-semibold text-sm shadow-sm transition-all disabled:cursor-not-allowed"
        >
          <Flag className="w-4 h-4" />
          Lap
        </button>
        <button
          onClick={reset}
          disabled={elapsed === 0}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 rounded-xl font-semibold text-sm shadow-sm transition-all disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Laps Table */}
      {laps.length > 0 && (
        <div className="text-left overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Lap</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Split Time</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Overall Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[...laps].reverse().map(l => (
                <tr key={l.n} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium">#{l.n}</td>
                  <td className="px-4 py-2 text-right font-mono text-gray-900 dark:text-gray-100">{fmt(l.split)}</td>
                  <td className="px-4 py-2 text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">{fmt(l.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
