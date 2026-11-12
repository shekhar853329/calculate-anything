import { useState, useRef, useEffect } from 'react';

export default function CountdownTimer() {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('0');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = (parseInt(hours)||0)*3600 + (parseInt(minutes)||0)*60 + (parseInt(seconds)||0);

  function start() {
    if (remaining === null) setRemaining(total);
    setRunning(true);
    setFinished(false);
  }

  function pause() { setRunning(false); }

  function reset() {
    setRunning(false);
    setRemaining(null);
    setFinished(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r === null) return null;
          if (r <= 1) {
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const display = remaining !== null ? remaining : total;
  const h = Math.floor(display / 3600);
  const m = Math.floor((display % 3600) / 60);
  const s = display % 60;
  const pct = total > 0 ? (display / total) * 100 : 100;

  return (
    <div className="space-y-6 text-center">
      {finished && (
        <div className="bg-green-50 dark:bg-green-950 border-2 border-green-400 rounded-xl p-4 text-green-700 dark:text-green-300 font-bold text-xl animate-bounce">
          ⏰ Time's Up!
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[{ label: 'Hours', val: hours, set: setHours, max: 99 },
          { label: 'Minutes', val: minutes, set: setMinutes, max: 59 },
          { label: 'Seconds', val: seconds, set: setSeconds, max: 59 }].map(f => (
          <div key={f.label}>
            <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
            <input type="number" min={0} max={f.max} value={f.val}
              onChange={e => { f.set(e.target.value); reset(); }}
              disabled={running}
              className="w-full border rounded-lg px-2 py-2 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-60" />
          </div>
        ))}
      </div>

      <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400">
        {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
      </div>

      <div className="max-w-sm mx-auto">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <button onClick={start} disabled={total === 0}
            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 font-semibold">
            {remaining === null ? '▶ Start' : '▶ Resume'}
          </button>
        ) : (
          <button onClick={pause}
            className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 font-semibold">
            ⏸ Pause
          </button>
        )}
        <button onClick={reset}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold">
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
