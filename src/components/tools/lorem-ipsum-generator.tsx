import React, { useState, useCallback } from 'react';

const WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nulla gravida orci a odio tempus porta blandit luctus augue praesent egestas neque suspendisse sed leo elementum sodales volutpat luctus enim congue convallis dictumst nunc rutrum fringilla euismod facilisis magna non eros mauris blandit`.split(' ');

function randomWord(exclude?: string): string {
  let word = WORDS[Math.floor(Math.random() * WORDS.length)];
  if (exclude) {
    while (word === exclude) word = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return word;
}

function generateWords(count: number, startWithLorem: boolean): string {
  const words: string[] = [];
  if (startWithLorem) {
    words.push('Lorem', 'ipsum');
    for (let i = 2; i < count; i++) words.push(randomWord());
  } else {
    for (let i = 0; i < count; i++) words.push(randomWord());
    if (words.length > 0) words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words.join(' ') + '.';
}

function generateSentences(count: number): string[] {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const wordCount = Math.floor(Math.random() * 10) + 8;
    const words: string[] = [];
    for (let j = 0; j < wordCount; j++) words.push(randomWord());
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    sentences.push(words.join(' ') + '.');
  }
  return sentences;
}

function generateParagraphs(count: number, startWithLorem: boolean): string[] {
  const paragraphs: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentCount = Math.floor(Math.random() * 4) + 3;
    const sents = generateSentences(sentCount);
    if (p === 0 && startWithLorem) {
      sents[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    }
    paragraphs.push(sents.join(' '));
  }
  return paragraphs;
}

type Mode = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState<Mode>('paragraphs');
  const [count, setCount] = useState(3);
  const [startLorem, setStartLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    if (mode === 'paragraphs') {
      setOutput(generateParagraphs(count, startLorem).join('\n\n'));
    } else if (mode === 'sentences') {
      const sents = generateSentences(count);
      if (startLorem) sents[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      setOutput(sents.join(' '));
    } else {
      setOutput(generateWords(count, startLorem));
    }
  }, [mode, count, startLorem]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generate</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as Mode)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Count</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer select-none mb-0.5">
            <input
              type="checkbox"
              checked={startLorem}
              onChange={e => setStartLorem(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Start with "Lorem ipsum"</span>
          </label>
        </div>
      </div>

      <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
        Generate
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <button onClick={copy} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-200 max-h-72 overflow-auto leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
