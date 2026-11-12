import React, { useState, useCallback, useRef } from 'react';

export default function Base64EncoderDecoder() {
  const [text, setText] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [copiedEnc, setCopiedEnc] = useState(false);
  const [copiedDec, setCopiedDec] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const encode = useCallback((value: string) => {
    try {
      setEncoded(btoa(unescape(encodeURIComponent(value))));
    } catch {
      setEncoded('Encoding error');
    }
  }, []);

  const decode = useCallback((value: string) => {
    setDecodeError('');
    try {
      setDecoded(decodeURIComponent(escape(atob(value.trim()))));
    } catch {
      setDecodeError('Invalid Base64 input');
      setDecoded('');
    }
  }, []);

  const handleTextChange = (val: string) => {
    setText(val);
    encode(val);
    decode(val);
  };

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is data URL like "data:type;base64,..."
      const b64 = result.split(',')[1] ?? '';
      setEncoded(b64);
      setDecoded('');
      setText('');
    };
    reader.readAsDataURL(file);
  }, []);

  const copyEnc = () => { navigator.clipboard.writeText(encoded).then(() => { setCopiedEnc(true); setTimeout(() => setCopiedEnc(false), 2000); }); };
  const copyDec = () => { navigator.clipboard.writeText(decoded).then(() => { setCopiedDec(true); setTimeout(() => setCopiedDec(false), 2000); }); };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input Text</label>
        <textarea
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          rows={4}
          placeholder="Enter text to encode or Base64 to decode..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base64 Encoded</label>
            <button onClick={copyEnc} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{copiedEnc ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea
            readOnly
            value={encoded}
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-none break-all"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base64 Decoded</label>
            <button onClick={copyDec} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{copiedDec ? '✓ Copied' : 'Copy'}</button>
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
        onClick={() => { setText(''); setEncoded(''); setDecoded(''); setDecodeError(''); if (fileRef.current) fileRef.current.value = ''; }}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        Clear
      </button>
    </div>
  );
}
