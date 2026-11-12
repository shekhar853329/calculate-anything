import { useState, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [recording, setRecording] = useState(false);
  const [copied, setCopied] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);

  const supported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let final = '';
      let inter = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript + ' ';
        else inter += r[0].transcript;
      }
      if (final) setTranscript(t => t + final);
      setInterim(inter);
    };

    rec.onend = () => { setRecording(false); setInterim(''); };
    rec.onerror = () => { setRecording(false); setInterim(''); };
    rec.start();
    recRef.current = rec;
    setRecording(true);
  }

  function stop() {
    recRef.current?.stop();
    setRecording(false);
  }

  function copy() {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!supported) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        Your browser does not support the Web Speech API for speech recognition.
        Try Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center">
        {!recording ? (
          <button onClick={start}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold">
            🎙 Start Recording
          </button>
        ) : (
          <button onClick={stop}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 font-semibold animate-pulse">
            ⏹ Stop
          </button>
        )}
        {recording && (
          <span className="text-sm text-red-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping inline-block" />
            Recording…
          </span>
        )}
      </div>

      <div className="border rounded-xl p-4 min-h-32 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <span className="text-gray-900 dark:text-gray-100">{transcript}</span>
        <span className="text-gray-400 italic">{interim}</span>
        {!transcript && !interim && (
          <span className="text-gray-400 text-sm">Your transcript will appear here…</span>
        )}
      </div>

      {transcript && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={copy}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button onClick={() => setTranscript('')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
            Clear
          </button>
          <span className="text-xs text-gray-400 self-center">
            {transcript.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      )}
    </div>
  );
}
