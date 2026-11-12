import React, { useState, useCallback, useRef } from 'react';
import { md5 } from '@noble/hashes/legacy';
import { sha1 } from '@noble/hashes/sha1';
import { sha256, sha512 } from '@noble/hashes/sha2';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function computeHashes(input: Uint8Array) {
  return {
    md5: bytesToHex(md5(input)),
    sha1: bytesToHex(sha1(input)),
    sha256: bytesToHex(sha256(input)),
    sha512: bytesToHex(sha512(input)),
  };
}

type HashResult = { md5: string; sha1: string; sha256: string; sha512: string };

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [copiedKey, setCopiedKey] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const generate = useCallback((input: Uint8Array) => {
    setHashes(computeHashes(input));
  }, []);

  const handleText = useCallback((val: string) => {
    setText(val);
    const enc = new TextEncoder();
    generate(enc.encode(val));
  }, [generate]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const buf = reader.result as ArrayBuffer;
      generate(new Uint8Array(buf));
      setText('');
    };
    reader.readAsArrayBuffer(file);
  }, [generate]);

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    });
  };

  const reset = () => {
    setText('');
    setHashes(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const hashEntries = hashes
    ? [
        { label: 'MD5', key: 'md5', value: hashes.md5 },
        { label: 'SHA-1', key: 'sha1', value: hashes.sha1 },
        { label: 'SHA-256', key: 'sha256', value: hashes.sha256 },
        { label: 'SHA-512', key: 'sha512', value: hashes.sha512 },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Text</label>
        <textarea
          value={text}
          onChange={e => handleText(e.target.value)}
          rows={4}
          placeholder="Type text to hash..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or upload a file</label>
        <input
          ref={fileRef}
          type="file"
          onChange={handleFile}
          className="text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
        />
      </div>

      <button onClick={reset} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
        Reset
      </button>

      {hashEntries.length > 0 && (
        <div className="space-y-3">
          {hashEntries.map(entry => (
            <div key={entry.key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{entry.label}</span>
                <button onClick={() => copy(entry.key, entry.value)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  {copiedKey === entry.key ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <code className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">{entry.value}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
