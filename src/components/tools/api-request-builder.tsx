import React, { useState, useCallback, useMemo } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type BodyType = 'none' | 'json' | 'form';

interface Header { key: string; value: string }

export default function ApiRequestBuilder() {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('https://api.example.com/users');
  const [headers, setHeaders] = useState<Header[]>([{ key: 'Content-Type', value: 'application/json' }]);
  const [bodyType, setBodyType] = useState<BodyType>('none');
  const [bodyJson, setBodyJson] = useState('{\n  "name": "Alice"\n}');
  const [formFields, setFormFields] = useState<Header[]>([{ key: 'field', value: 'value' }]);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedFetch, setCopiedFetch] = useState(false);
  const [activeTab, setActiveTab] = useState<'curl' | 'fetch'>('curl');

  const addHeader = () => setHeaders(prev => [...prev, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders(prev => prev.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 'key' | 'value', val: string) =>
    setHeaders(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: val } : h));

  const addField = () => setFormFields(prev => [...prev, { key: '', value: '' }]);
  const removeField = (i: number) => setFormFields(prev => prev.filter((_, idx) => idx !== i));
  const updateField = (i: number, field: 'key' | 'value', val: string) =>
    setFormFields(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: val } : h));

  const { curlCode, fetchCode } = useMemo(() => {
    const validHeaders = headers.filter(h => h.key.trim());
    const hasBody = method !== 'GET' && method !== 'DELETE' && bodyType !== 'none';
    const bodyContent = bodyType === 'json' ? bodyJson : bodyType === 'form'
      ? formFields.filter(f => f.key).map(f => `${encodeURIComponent(f.key)}=${encodeURIComponent(f.value)}`).join('&')
      : '';

    // Curl
    const curlHeaders = validHeaders.map(h => `  -H "${h.key}: ${h.value}"`).join(' \\\n');
    const curlBody = hasBody
      ? bodyType === 'json' ? `\\\n  -d '${bodyJson.replace(/'/g, "\\'")}'` : `\\\n  --data-urlencode '${bodyContent}'`
      : '';
    const curl = `curl -X ${method} "${url}" \\\n${curlHeaders}${curlHeaders && hasBody ? ' \\\n' : ''}${curlBody}`.trim();

    // Fetch
    const fetchHeadersObj = validHeaders.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
    const fetchOptions: Record<string, any> = { method };
    if (Object.keys(fetchHeadersObj).length > 0) fetchOptions.headers = fetchHeadersObj;
    if (hasBody) fetchOptions.body = bodyType === 'json' ? bodyJson : bodyContent;

    const fetchOpts = Object.keys(fetchOptions).length > 1 || fetchOptions.method !== 'GET'
      ? JSON.stringify(fetchOptions, null, 2)
      : '{}';

    const fetch_ = `const response = await fetch("${url}", ${fetchOpts});\nconst data = await response.json();\nconsole.log(data);`;

    return { curlCode: curl, fetchCode: fetch_ };
  }, [method, url, headers, bodyType, bodyJson, formFields]);

  const copy = (text: string, type: 'curl' | 'fetch') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'curl') { setCopiedCurl(true); setTimeout(() => setCopiedCurl(false), 2000); }
      else { setCopiedFetch(true); setTimeout(() => setCopiedFetch(false), 2000); }
    });
  };

  const methods: Method[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const methodColors: Record<Method, string> = {
    GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PUT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    PATCH: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <div className="space-y-5">
      {/* Method + URL */}
      <div className="flex gap-3">
        <select value={method} onChange={e => setMethod(e.target.value as Method)}
          className={`rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${methodColors[method]}`}>
          {methods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://api.example.com/endpoint" />
      </div>

      {/* Headers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Headers</label>
          <button onClick={addHeader} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">+ Add Header</button>
        </div>
        <div className="space-y-2">
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={h.key} onChange={e => updateHeader(i, 'key', e.target.value)}
                placeholder="Key"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => removeHeader(i)} className="text-red-500 hover:text-red-700 text-lg leading-none px-1">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      {method !== 'GET' && method !== 'DELETE' && (
        <div>
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Body</label>
            {(['none', 'json', 'form'] as BodyType[]).map(bt => (
              <label key={bt} className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="radio" name="bodyType" value={bt} checked={bodyType === bt} onChange={() => setBodyType(bt)}
                  className="text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{bt === 'none' ? 'None' : bt === 'json' ? 'JSON' : 'Form'}</span>
              </label>
            ))}
          </div>
          {bodyType === 'json' && (
            <textarea value={bodyJson} onChange={e => setBodyJson(e.target.value)} rows={5}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
          )}
          {bodyType === 'form' && (
            <div className="space-y-2">
              {formFields.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={f.key} onChange={e => updateField(i, 'key', e.target.value)} placeholder="Key"
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" value={f.value} onChange={e => updateField(i, 'value', e.target.value)} placeholder="Value"
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={() => removeField(i)} className="text-red-500 hover:text-red-700 text-lg leading-none px-1">×</button>
                </div>
              ))}
              <button onClick={addField} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">+ Add Field</button>
            </div>
          )}
        </div>
      )}

      {/* Code Output */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {(['curl', 'fetch'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
              {tab === 'curl' ? 'cURL' : 'fetch()'}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono overflow-auto max-h-56 whitespace-pre-wrap">
            {activeTab === 'curl' ? curlCode : fetchCode}
          </pre>
          <button
            onClick={() => copy(activeTab === 'curl' ? curlCode : fetchCode, activeTab)}
            className="absolute top-2 right-2 text-xs text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {activeTab === 'curl' ? (copiedCurl ? '✓' : 'Copy') : (copiedFetch ? '✓' : 'Copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
