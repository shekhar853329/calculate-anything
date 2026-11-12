import React, { useState, useCallback } from 'react';

function base64UrlDecode(str: string): string {
  const pad = str.length % 4;
  const padded = pad ? str + '='.repeat(4 - pad) : str;
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  } catch {
    return atob(base64);
  }
}

interface JwtParts {
  header: object;
  payload: object;
  signature: string;
}

function decodeJwt(token: string): { parts: JwtParts; error: string } {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return { parts: {} as JwtParts, error: 'Invalid JWT format: expected 3 parts separated by dots.' };
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { parts: { header, payload, signature: parts[2] }, error: '' };
  } catch (e: any) {
    return { parts: {} as JwtParts, error: `Decode error: ${e.message}` };
  }
}

function getExpiryStatus(payload: any): { status: 'valid' | 'expired' | 'unknown'; label: string } {
  if (!payload.exp) return { status: 'unknown', label: 'No expiry set' };
  const exp = new Date(payload.exp * 1000);
  if (exp < new Date()) return { status: 'expired', label: `Expired on ${exp.toLocaleString()}` };
  return { status: 'valid', label: `Valid until ${exp.toLocaleString()}` };
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const decode = useCallback(() => {
    setError('');
    setResult(null);
    if (!token.trim()) { setError('Please enter a JWT token.'); return; }
    const { parts, error: err } = decodeJwt(token);
    if (err) { setError(err); return; }
    setResult(parts);
  }, [token]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    });
  };

  const expiry = result ? getExpiryStatus(result.payload as any) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">JWT Token</label>
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}
      <div className="flex gap-3">
        <button onClick={decode} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Decode</button>
        <button onClick={() => { setToken(''); setResult(null); setError(''); }} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset</button>
      </div>

      {result && (
        <div className="space-y-4">
          {expiry && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              expiry.status === 'valid' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
              expiry.status === 'expired' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
              'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}>
              <span>{expiry.status === 'valid' ? '✓' : expiry.status === 'expired' ? '✗' : 'ℹ'}</span>
              <span>{expiry.label}</span>
            </div>
          )}

          {(['header', 'payload'] as const).map(part => (
            <div key={part}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{part}</label>
                <button onClick={() => copy(JSON.stringify(result[part], null, 2), part)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  {copiedKey === part ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm font-mono overflow-auto max-h-48 whitespace-pre-wrap">
                {JSON.stringify(result[part], null, 2)}
              </pre>
            </div>
          ))}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Signature</label>
              <button onClick={() => copy(result.signature, 'sig')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                {copiedKey === 'sig' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
              {result.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
