import { useState, useEffect, useRef } from 'react';

const PARAGRAPHS = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly.',
  'Programming is the art of telling another human what one wants the computer to do. Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do. Innovation distinguishes between a leader and a follower.',
];

export default function TypingSpeedTest() {
  const [paragraph, setParagraph] = useState(PARAGRAPHS[0]);
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (started && !finished) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [started, finished]);

  function handleInput(val: string) {
    if (!started) setStarted(true);
    if (finished) return;
    setTyped(val);

    // Count errors
    let errs = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== paragraph[i]) errs++;
    }
    setErrors(errs);

    const correctChars = val.length - errs;
    const elapsed = 60 - timeLeft || 1;
    const currentWpm = Math.round((correctChars / 5) / (elapsed / 60));
    setWpm(currentWpm);
    const acc = val.length > 0 ? Math.round(((val.length - errs) / val.length) * 100) : 100;
    setAccuracy(acc);

    if (val.length >= paragraph.length) {
      clearInterval(intervalRef.current!);
      setFinished(true);
    }
  }

  function reset() {
    setParagraph(PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
    setTyped('');
    setStarted(false);
    setFinished(false);
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    textareaRef.current?.focus();
  }

  const renderText = () => {
    return paragraph.split('').map((char, i) => {
      let cls = 'text-gray-400';
      if (i < typed.length) cls = typed[i] === char ? 'text-green-600' : 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300';
      else if (i === typed.length) cls = 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100';
      return <span key={i} className={cls}>{char}</span>;
    });
  };

  return (
    <div className="space-y-5">
      {!finished ? (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <span className="font-medium">WPM: <span className="text-blue-600">{wpm}</span></span>
              <span className="font-medium">Accuracy: <span className="text-green-600">{accuracy}%</span></span>
              <span className="font-medium">Errors: <span className="text-red-500">{errors}</span></span>
            </div>
            <div className={`text-2xl font-bold font-mono ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`}>
              {timeLeft}s
            </div>
          </div>

          <div className="font-mono text-lg leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border select-none">
            {renderText()}
          </div>

          <textarea
            ref={textareaRef}
            value={typed}
            onChange={e => handleInput(e.target.value)}
            disabled={finished}
            placeholder="Start typing here…"
            rows={3}
            className="w-full border rounded-xl px-4 py-3 font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-60"
          />
        </>
      ) : (
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Test Complete! 🎉</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-600">{wpm}</p>
              <p className="text-sm text-gray-500">WPM</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-xl p-4">
              <p className="text-3xl font-bold text-red-500">{errors}</p>
              <p className="text-sm text-gray-500">Errors</p>
            </div>
          </div>
          <button onClick={reset}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
