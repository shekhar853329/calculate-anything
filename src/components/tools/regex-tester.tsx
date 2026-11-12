import React, { useState, useMemo } from 'react';

interface Match {
  fullMatch: string;
  groups: string[];
  index: number;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replacement, setReplacement] = useState('');
  const [mode, setMode] = useState<'match' | 'replace'>('match');
  const [error, setError] = useState('');

  const { matches, highlighted, replaceResult } = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testString, replaceResult: '' };
    try {
      setError('');
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const allMatches: Match[] = [];
      let m: RegExpExecArray | null;
      const safeRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

      while ((m = safeRegex.exec(testString)) !== null) {
        allMatches.push({ fullMatch: m[0], groups: m.slice(1), index: m.index });
        if (!flags.includes('g')) break;
        if (safeRegex.lastIndex === m.index) safeRegex.lastIndex++;
      }

      // Build highlighted HTML
      let result = '';
      let lastIndex = 0;
      const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      for (const match of allMatches) {
        result += escHtml(testString.slice(lastIndex, match.index));
        result += `<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">${escHtml(match.fullMatch)}</mark>`;
        lastIndex = match.index + match.fullMatch.length;
      }
      result += escHtml(testString.slice(lastIndex));

      // Replace
      let replaceRes = '';
      try {
        const rRegex = new RegExp(pattern, flags.includes('g') ? flags : flags);
        replaceRes = testString.replace(rRegex, replacement);
      } catch { replaceRes = ''; }

      return { matches: allMatches, highlighted: result, replaceResult: replaceRes };
    } catch (e: any) {
      setError(e.message);
      return { matches: [], highlighted: testString, replaceResult: '' };
    }
  }, [pattern, flags, testString, replacement]);

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Regex Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="e.g. \d+"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Flags</label>
          <div className="flex gap-1">
            {['g', 'i', 'm', 's'].map(f => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`px-3 py-2.5 rounded-lg text-sm font-mono font-medium border transition-colors ${
                  flags.includes(f)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test String</label>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          rows={4}
          placeholder="Enter text to test against the pattern..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex gap-3">
        {(['match', 'replace'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              mode === m ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}>
            {m} Mode
          </button>
        ))}
      </div>

      {mode === 'match' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Highlighted Matches</label>
            <span className="text-xs text-gray-500 dark:text-gray-400">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
          </div>
          <div
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-mono whitespace-pre-wrap min-h-16 max-h-40 overflow-auto"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
          {matches.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-auto">
              {matches.map((match, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400 mr-2">#{i + 1}</span>
                  <span className="font-mono text-yellow-700 dark:text-yellow-400">{match.fullMatch || '(empty)'}</span>
                  <span className="text-gray-400 dark:text-gray-500 ml-2">at index {match.index}</span>
                  {match.groups.length > 0 && (
                    <div className="mt-1 ml-6 text-xs text-gray-500 dark:text-gray-400">
                      Groups: {match.groups.map((g, j) => <span key={j} className="font-mono bg-blue-50 dark:bg-blue-900/30 px-1 rounded mr-1">{g ?? 'undefined'}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Replacement String</label>
            <input
              type="text"
              value={replacement}
              onChange={e => setReplacement(e.target.value)}
              placeholder="Replacement (use $1, $2 for groups)"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Result</label>
            <textarea
              readOnly
              value={replaceResult}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
