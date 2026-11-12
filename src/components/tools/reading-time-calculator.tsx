import { useState } from 'react';

export default function ReadingTimeCalculator() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const chars = text.length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;

  const totalSeconds = wordCount > 0 ? Math.ceil((wordCount / wpm) * 60) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const readingLabel = wordCount === 0 ? '—'
    : minutes === 0 ? `${seconds} sec`
    : seconds === 0 ? `${minutes} min`
    : `${minutes} min ${seconds} sec`;

  const speakingTime = wordCount > 0 ? Math.ceil((wordCount / 130) * 60) : 0;
  const speakM = Math.floor(speakingTime / 60);
  const speakS = speakingTime % 60;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Paste Your Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          placeholder="Paste your article, blog post, or document here…"
          className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reading Speed: {wpm} WPM</label>
        <input type="range" min={100} max={600} step={25} value={wpm}
          onChange={e => setWpm(Number(e.target.value))} className="w-full accent-blue-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Slow (100)</span><span>Average (200)</span><span>Fast (400)</span><span>Speed (600)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-600">{readingLabel}</p>
          <p className="text-xs text-gray-500 mt-1">Reading Time</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-purple-600">
            {speakingTime > 0 ? `${speakM}m ${speakS}s` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Speaking Time</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{wordCount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Words</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{chars.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Characters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <span className="font-bold">{sentences}</span> <span className="text-gray-500">Sentences</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <span className="font-bold">{paragraphs}</span> <span className="text-gray-500">Paragraphs</span>
        </div>
      </div>
    </div>
  );
}
