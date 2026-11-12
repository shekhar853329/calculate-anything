import React, { useState, useCallback } from 'react';

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [copiedEnc, setCopiedEnc] = useState(false);
  const [copiedDec, setCopiedDec] = useState(false);

  const handleChange = useCallback((value: string) => {
    setInput(value);
    setEncoded(encodeURIComponent(value));
    setDecodeError('');
    try {
      setDecoded(decodeURIComponent(value));
    } catch {
      setDecodeError('Invalid percent-encoded sequence');
      setDecoded('');
    }
  }, []);

  const copyEnc = () => {
    navigator.clipboard.writeText(encoded).then(() => {
      setCopiedEnc(true);
      setTimeout(() => setCopiedEnc(false), 2000);
    });
  };
  const copyDec = () => {
    navigator.clipboard.writeText(decoded).then(() => {
      setCopiedDec(true);
      setTimeout(() => setCopiedDec(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input</label>
        <textarea
          value={input}
          onChange={e => handleChange(e.target.value)}
          rows={4}
          placeholder="Enter a URL or text to encode/decode..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL Encoded</label>
            <button onClick={copyEnc} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              {copiedEnc ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={encoded}
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL Decoded</label>
            <button onClick={copyDec} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              {copiedDec ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={decoded}
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-none"
          />
          {decodeError && <p className="text-xs text-red-600 dark:text-red-400">{decodeError}</p>}
        </div>
      </div>

      <button
        onClick={() => handleChange('')}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        Clear
      </button>
    </div>
  );
}
