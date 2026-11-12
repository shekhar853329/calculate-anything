import { useState, useRef } from 'react';

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
    <div className="space-y-6 text-center">
      <div className="text-6xl font-mono font-bold tracking-tight text-blue-600 dark:text-blue-400">
        {fmt(elapsed)}
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {!running ? (
          <button onClick={start}
            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold">
            {elapsed === 0 ? '▶ Start' : '▶ Resume'}
          </button>
        ) : (
          <button onClick={stop}
            className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 font-semibold">
            ⏸ Stop
          </button>
        )}
        <button onClick={lap} disabled={!running}
          className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 font-semibold">
          🏁 Lap
        </button>
        <button onClick={reset}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold">
          ↺ Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="text-left overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-right">Lap Time</th>
                <th className="px-4 py-2 text-right">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {[...laps].reverse().map(l => (
                <tr key={l.n} className="border-t dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-500">Lap {l.n}</td>
                  <td className="px-4 py-2 text-right font-mono">{fmt(l.split)}</td>
                  <td className="px-4 py-2 text-right font-mono text-gray-500">{fmt(l.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
