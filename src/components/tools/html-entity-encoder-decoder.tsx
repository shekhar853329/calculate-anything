import React, { useState, useCallback } from 'react';

const ENTITIES: [string, string][] = [
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
  ['©', '&copy;'],
  ['®', '&reg;'],
  ['™', '&trade;'],
  ['€', '&euro;'],
  ['£', '&pound;'],
  ['¥', '&yen;'],
  ['°', '&deg;'],
  ['±', '&plusmn;'],
  ['×', '&times;'],
  ['÷', '&divide;'],
  ['¢', '&cent;'],
  ['§', '&sect;'],
  ['¶', '&para;'],
  ['·', '&middot;'],
  [' ', '&nbsp;'],
];

function encodeEntities(text: string): string {
  let result = text;
  for (const [char, entity] of ENTITIES) {
    result = result.split(char).join(entity);
  }
  return result;
}

function decodeEntities(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

export default function HtmlEntityEncoderDecoder() {
  const [input, setInput] = useState('');
  const [encResult, setEncResult] = useState('');
  const [decResult, setDecResult] = useState('');
  const [copiedEnc, setCopiedEnc] = useState(false);
  const [copiedDec, setCopiedDec] = useState(false);

  const handleChange = useCallback((val: string) => {
    setInput(val);
    setEncResult(encodeEntities(val));
    setDecResult(decodeEntities(val));
  }, []);

  const copyEnc = () => { navigator.clipboard.writeText(encResult).then(() => { setCopiedEnc(true); setTimeout(() => setCopiedEnc(false), 2000); }); };
  const copyDec = () => { navigator.clipboard.writeText(decResult).then(() => { setCopiedDec(true); setTimeout(() => setCopiedDec(false), 2000); }); };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input</label>
        <textarea
          value={input}
          onChange={e => handleChange(e.target.value)}
          rows={4}
          placeholder='Enter text with HTML or entities like <div> or &amp;'
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Encoded</label>
            <button onClick={copyEnc} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{copiedEnc ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={encResult} rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-none" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Decoded</label>
            <button onClick={copyDec} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{copiedDec ? '✓ Copied' : 'Copy'}</button>
          </div>
          <textarea readOnly value={decResult} rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-none" />
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Common HTML Entities</p>
        <div className="flex flex-wrap gap-2">
          {ENTITIES.slice(0, 10).map(([char, entity]) => (
            <span key={entity} className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-0.5">
              {char === ' ' ? '(space)' : char} → {entity}
            </span>
          ))}
        </div>
      </div>
      <button onClick={() => handleChange('')}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
        Clear
      </button>
    </div>
  );
}
