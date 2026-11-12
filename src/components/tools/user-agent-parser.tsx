import React, { useState, useCallback, useEffect } from 'react';

interface UAResult {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  raw: string;
}

function parseUA(ua: string): UAResult {
  const raw = ua;
  let browser = 'Unknown', browserVersion = '', os = 'Unknown', osVersion = '', device = 'Desktop', engine = 'Unknown';

  // Browser detection (order matters)
  const browserPatterns: [RegExp, string][] = [
    [/Edg\/(\S+)/, 'Microsoft Edge'],
    [/OPR\/(\S+)/, 'Opera'],
    [/Opera\/(\S+)/, 'Opera'],
    [/SamsungBrowser\/(\S+)/, 'Samsung Internet'],
    [/UCBrowser\/(\S+)/, 'UC Browser'],
    [/YaBrowser\/(\S+)/, 'Yandex Browser'],
    [/Firefox\/(\S+)/, 'Firefox'],
    [/FxiOS\/(\S+)/, 'Firefox iOS'],
    [/CriOS\/(\S+)/, 'Chrome iOS'],
    [/Chrome\/(\S+)/, 'Chrome'],
    [/Safari\/(\S+)/, 'Safari'],
    [/MSIE (\S+)/, 'Internet Explorer'],
    [/Trident\/.*rv:(\S+)/, 'Internet Explorer'],
  ];

  for (const [pattern, name] of browserPatterns) {
    const m = ua.match(pattern);
    if (m) {
      browser = name;
      browserVersion = m[1].replace(/[;)].*/,'');
      break;
    }
  }

  // Engine
  if (/Gecko\//.test(ua) && !/like Gecko/.test(ua)) engine = 'Gecko';
  else if (/AppleWebKit\//.test(ua)) engine = 'WebKit / Blink';
  else if (/Trident\//.test(ua)) engine = 'Trident';
  else if (/Presto\//.test(ua)) engine = 'Presto';

  // OS
  const osPatterns: [RegExp, string, number?][] = [
    [/Windows NT (\d+\.\d+)/, 'Windows', 1],
    [/Mac OS X ([\d_]+)/, 'macOS', 1],
    [/Android (\d+[\.\d]*)/, 'Android', 1],
    [/iPhone OS ([\d_]+)/, 'iOS', 1],
    [/iPad; CPU OS ([\d_]+)/, 'iPadOS', 1],
    [/Linux/, 'Linux'],
    [/CrOS/, 'ChromeOS'],
  ];

  for (const [pattern, name, group] of osPatterns) {
    const m = ua.match(pattern);
    if (m) {
      os = name;
      if (group) {
        osVersion = m[group].replace(/_/g, '.');
        if (os === 'Windows') {
          const ntMap: Record<string, string> = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP' };
          osVersion = ntMap[osVersion] || osVersion;
        }
      }
      break;
    }
  }

  // Device type
  if (/Mobile|Android.*Mobile|iPhone|iPod/.test(ua)) device = 'Mobile';
  else if (/iPad|Android(?!.*Mobile)|Tablet/.test(ua)) device = 'Tablet';
  else if (/Smart-TV|SmartTV|GoogleTV|BRAVIA/.test(ua)) device = 'Smart TV';
  else if (/bot|crawler|spider|slurp|bingbot|googlebot/i.test(ua)) device = 'Bot/Crawler';
  else device = 'Desktop';

  return { browser, browserVersion, os, osVersion, device, engine, raw };
}

export default function UserAgentParser() {
  const [ua, setUa] = useState('');
  const [result, setResult] = useState<UAResult | null>(null);

  useEffect(() => {
    const current = navigator.userAgent;
    setUa(current);
    setResult(parseUA(current));
  }, []);

  const analyze = useCallback(() => {
    if (ua.trim()) setResult(parseUA(ua));
  }, [ua]);

  const rows = result ? [
    { label: 'Browser', value: result.browser + (result.browserVersion ? ` ${result.browserVersion}` : '') },
    { label: 'Engine', value: result.engine },
    { label: 'Operating System', value: result.os + (result.osVersion ? ` ${result.osVersion}` : '') },
    { label: 'Device Type', value: result.device },
  ] : [];

  const deviceIcon: Record<string, string> = {
    'Mobile': '📱', 'Tablet': '⬛', 'Desktop': '🖥️', 'Smart TV': '📺', 'Bot/Crawler': '🤖',
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User-Agent String</label>
        <textarea
          value={ua}
          onChange={e => setUa(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled with your current browser's user agent</p>
      </div>

      <div className="flex gap-3">
        <button onClick={analyze} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Parse</button>
        <button onClick={() => { const c = navigator.userAgent; setUa(c); setResult(parseUA(c)); }}
          className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
          Use Current UA
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rows.map(row => (
              <div key={row.label} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{row.label}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {row.label === 'Device Type' ? `${deviceIcon[result.device] ?? ''} ` : ''}{row.value}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Raw User-Agent</p>
            <code className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{result.raw}</code>
          </div>
        </div>
      )}
    </div>
  );
}
