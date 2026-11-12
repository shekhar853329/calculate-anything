import React, { useState, useCallback, useRef } from 'react';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple MD5 implementation (no dependencies)
function md5Hash(input: Uint8Array): string {
  function safeAdd(x: number, y: number) { return (x + y) & 0xffffffff; }
  function rotl(n: number, s: number) { return (n << s) | (n >>> (32 - s)); }
  function hex(n: number) {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return s;
  }
  const str = Array.from(input).map(b => String.fromCharCode(b)).join('');
  const l = str.length;
  const words: number[] = [];
  for (let i = 0; i < l; i++) {
    words[i >> 2] |= str.charCodeAt(i) << ((i & 3) * 8);
  }
  words[l >> 2] |= 0x80 << ((l & 3) * 8);
  words[(((l + 64) >>> 9) << 4) + 14] = l * 8;
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const T = new Int32Array(64);
  for (let i = 0; i < 64; i++) T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  const X = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
              5, 9,14,20,5, 9,14,20,5, 9,14,20,5, 9,14,20,
              4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
              6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  for (let i = 0; i < words.length; i += 16) {
    let [aa,bb,cc,dd] = [a,b,c,d];
    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if (j < 16) { f = (b & c) | (~b & d); g = j; }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5*j+1)%16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3*j+5)%16; }
      else { f = c ^ (b | ~d); g = (7*j)%16; }
      const tmp = d; d = c; c = b;
      b = safeAdd(b, rotl(safeAdd(safeAdd(a, f), safeAdd(T[j], words[i+g]||0)), X[j]));
      a = tmp;
    }
    a=safeAdd(a,aa); b=safeAdd(b,bb); c=safeAdd(c,cc); d=safeAdd(d,dd);
  }
  return hex(a)+hex(b)+hex(c)+hex(d);
}

async function computeHashes(input: Uint8Array) {
  const digest = async (algo: string) => {
    const buf = await crypto.subtle.digest(algo, input);
    return bytesToHex(new Uint8Array(buf));
  };
  const [sha1, sha256, sha512] = await Promise.all([
    digest('SHA-1'), digest('SHA-256'), digest('SHA-512')
  ]);
  return { md5: md5Hash(input), sha1, sha256, sha512 };
}

type HashResult = { md5: string; sha1: string; sha256: string; sha512: string };

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [copiedKey, setCopiedKey] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const generate = useCallback(async (input: Uint8Array) => {
    const result = await computeHashes(input);
    setHashes(result);
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
