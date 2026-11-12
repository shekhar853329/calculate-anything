import React, { useState, useMemo } from 'react';

export default function WordCharacterCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const uniqueWords = text.trim() === '' ? 0 : new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);
    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, uniqueWords, readingTime, speakingTime };
  }, [text]);

  const statItems = [
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpaces },
    { label: 'Words', value: stats.words },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Lines', value: stats.lines },
    { label: 'Unique Words', value: stats.uniqueWords },
    { label: 'Reading Time', value: `~${stats.readingTime} min` },
    { label: 'Speaking Time', value: `~${stats.speakingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          placeholder="Start typing or paste your text here..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statItems.map(item => (
          <div key={item.label} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.value}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Reading time at 200 wpm · Speaking time at 130 wpm</p>
    </div>
  );
}
