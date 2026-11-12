import { useState, useRef, useEffect } from 'react';

type Phase = 'work' | 'short-break' | 'long-break';

const PHASES: Record<Phase, { label: string; color: string; default: number }> = {
  'work': { label: 'Work', color: 'bg-red-500', default: 25 },
  'short-break': { label: 'Short Break', color: 'bg-green-500', default: 5 },
  'long-break': { label: 'Long Break', color: 'bg-blue-500', default: 15 },
};

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>('work');
  const [durations, setDurations] = useState({ work: 25, 'short-break': 5, 'long-break': 15 });
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  function beep() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            beep();
            if (intervalRef.current) clearInterval(intervalRef.current);
            setRunning(false);
            // Auto-advance
            setPhase(p => {
              if (p === 'work') {
                const newSessions = sessions + 1;
                setSessions(newSessions);
                const nextPhase = newSessions % 4 === 0 ? 'long-break' : 'short-break';
                setRemaining(durations[nextPhase] * 60);
                return nextPhase;
              } else {
                setRemaining(durations['work'] * 60);
                return 'work';
              }
            });
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, sessions, durations]);

  function switchPhase(p: Phase) {
    setRunning(false);
    setPhase(p);
    setRemaining(durations[p] * 60);
  }

  function reset() {
    setRunning(false);
    setRemaining(durations[phase] * 60);
  }

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const total = durations[phase] * 60;
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const cfg = PHASES[phase];

  return (
    <div className="space-y-6 text-center max-w-md mx-auto">
      <div className="flex justify-center gap-2 flex-wrap">
        {(Object.keys(PHASES) as Phase[]).map(p => (
          <button key={p} onClick={() => switchPhase(p)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${phase === p ? `${PHASES[p].color} text-white` : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
            {PHASES[p].label}
          </button>
        ))}
      </div>

      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200 dark:text-gray-700" />
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
            strokeLinecap="round"
            className={phase === 'work' ? 'text-red-500' : phase === 'short-break' ? 'text-green-500' : 'text-blue-500'}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold">
            {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
          </span>
          <span className="text-xs text-gray-500">{cfg.label}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setRunning(r => !r)}
          className={`px-8 py-2 ${cfg.color} text-white rounded-xl font-semibold`}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={reset}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold">
          ↺
        </button>
      </div>

      <div className="flex justify-center gap-6 text-sm">
        <div>
          <span className="text-2xl font-bold text-red-500">{sessions}</span>
          <p className="text-xs text-gray-500">Pomodoros</p>
        </div>
        <div>
          <span className="text-2xl font-bold text-green-500">{Math.floor(sessions / 4)}</span>
          <p className="text-xs text-gray-500">Long Breaks</p>
        </div>
      </div>
    </div>
  );
}
