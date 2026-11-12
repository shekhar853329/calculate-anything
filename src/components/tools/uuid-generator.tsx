import React, { useState, useCallback } from 'react';

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Polyfill
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatUUID(uuid: string, format: string): string {
  const clean = uuid.replace(/-/g, '');
  switch (format) {
    case 'no-dashes': return clean;
    case 'braces': return `{${uuid}}`;
    case 'urn': return `urn:uuid:${uuid}`;
    default: return uuid;
  }
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState('standard');
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => formatUUID(generateUUIDv4(), format));
    setUuids(list);
  }, [count, format]);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  }, [uuids]);

  const copyOne = (idx: number) => {
    navigator.clipboard.writeText(uuids[idx]).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Count (1–100)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
          <select
            value={format}
            onChange={e => setFormat(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Standard (xxxxxxxx-xxxx-...)</option>
            <option value="no-dashes">No Dashes</option>
            <option value="braces">Braces {'{xxxxxxxx-...}'}</option>
            <option value="urn">URN (urn:uuid:...)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Generate</button>
        {uuids.length > 0 && (
          <button onClick={copyAll} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
            {copiedAll ? '✓ Copied All' : 'Copy All'}
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 max-h-72 overflow-auto">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2">
              <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{uuid}</span>
              <button onClick={() => copyOne(i)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-4 shrink-0">
                {copiedIdx === i ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
