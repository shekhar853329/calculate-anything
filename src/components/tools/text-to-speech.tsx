import { useState, useEffect, useRef } from 'react';

export default function TextToSpeech() {
  const [text, setText] = useState('Hello! Welcome to the Text to Speech tool. Type your text here and click Play to hear it.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    function loadVoices() {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      if (v.length) setSelectedVoice(v[0].name);
    }
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.cancel(); };
  }, [supported]);

  function play() {
    if (!supported || !text.trim()) return;
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utt.voice = voice;
    utt.rate = rate;
    utt.pitch = pitch;
    utt.volume = volume;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    uttRef.current = utt;
    speechSynthesis.speak(utt);
  }

  function stop() {
    speechSynthesis.cancel();
    setSpeaking(false);
  }

  if (!supported) {
    return <div className="p-4 bg-red-50 rounded-lg text-red-600">Your browser does not support the Web Speech API.</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Text to Speak</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        <p className="text-xs text-gray-400 mt-1">{text.length} characters</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Voice</label>
          <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700">
            {voices.map(v => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {[
            { label: `Speed: ${rate}x`, val: rate, set: setRate, min: 0.5, max: 2, step: 0.1 },
            { label: `Pitch: ${pitch}`, val: pitch, set: setPitch, min: 0, max: 2, step: 0.1 },
            { label: `Volume: ${Math.round(volume * 100)}%`, val: volume, set: setVolume, min: 0, max: 1, step: 0.05 },
          ].map(s => (
            <div key={s.label}>
              <label className="block text-xs mb-1">{s.label}</label>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                onChange={e => s.set(parseFloat(e.target.value))} className="w-full accent-blue-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={play} disabled={speaking || !text.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium">
          {speaking ? '🔊 Speaking…' : '▶ Play'}
        </button>
        {speaking && (
          <button onClick={stop}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  );
}
