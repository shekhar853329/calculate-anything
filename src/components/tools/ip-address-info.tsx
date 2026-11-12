import React, { useState, useCallback } from 'react';

interface IpInfo {
  address: string;
  version: string;
  class: string;
  type: string;
  octets: number[];
  binary: string;
  subnet: string;
  defaultMask: string;
  range: string;
  loopback: boolean;
  linkLocal: boolean;
  notes: string;
}

function parseIPv4(ip: string): IpInfo | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;

  const binary = octets.map(o => o.toString(2).padStart(8, '0')).join('.');
  const first = octets[0];

  let ipClass = '';
  let defaultMask = '';
  let range = '';
  if (first < 128) { ipClass = 'A'; defaultMask = '255.0.0.0'; range = '0.0.0.0 – 127.255.255.255'; }
  else if (first < 192) { ipClass = 'B'; defaultMask = '255.255.0.0'; range = '128.0.0.0 – 191.255.255.255'; }
  else if (first < 224) { ipClass = 'C'; defaultMask = '255.255.255.0'; range = '192.0.0.0 – 223.255.255.255'; }
  else if (first < 240) { ipClass = 'D (Multicast)'; defaultMask = 'N/A'; range = '224.0.0.0 – 239.255.255.255'; }
  else { ipClass = 'E (Reserved)'; defaultMask = 'N/A'; range = '240.0.0.0 – 255.255.255.255'; }

  const isPrivate =
    (first === 10) ||
    (first === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (first === 192 && octets[1] === 168);
  const isLoopback = first === 127;
  const isLinkLocal = first === 169 && octets[1] === 254;
  const isMulticast = first >= 224 && first <= 239;

  let type = 'Public';
  if (isPrivate) type = 'Private';
  if (isLoopback) type = 'Loopback';
  if (isLinkLocal) type = 'Link-Local';
  if (isMulticast) type = 'Multicast';

  const subnet = defaultMask !== 'N/A'
    ? `${ip}/${defaultMask === '255.0.0.0' ? 8 : defaultMask === '255.255.0.0' ? 16 : 24}`
    : 'N/A';

  const notes =
    isLoopback ? 'Loopback address — refers to the local machine.' :
    isLinkLocal ? 'Link-local address — not routable beyond the local network segment.' :
    isPrivate ? 'Private address — not routable on the public internet.' :
    isMulticast ? 'Multicast address — used to address multiple receivers.' :
    first === 0 ? 'Reserved — "this" network.' :
    first === 255 ? 'Limited broadcast address.' : '';

  return { address: ip, version: 'IPv4', class: ipClass, type, octets, binary, subnet, defaultMask, range, loopback: isLoopback, linkLocal: isLinkLocal, notes };
}

export default function IpAddressInfo() {
  const [input, setInput] = useState('');
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [error, setError] = useState('');

  const analyze = useCallback(() => {
    setError('');
    setInfo(null);
    const val = input.trim();
    if (!val) { setError('Please enter an IP address.'); return; }
    const result = parseIPv4(val);
    if (!result) { setError('Invalid IPv4 address. Please enter a valid address (e.g. 192.168.1.1).'); return; }
    setInfo(result);
  }, [input]);

  const rows = info ? [
    { label: 'IP Address', value: info.address },
    { label: 'Version', value: info.version },
    { label: 'Class', value: info.class },
    { label: 'Type', value: info.type },
    { label: 'Default Subnet Mask', value: info.defaultMask },
    { label: 'CIDR Notation', value: info.subnet },
    { label: 'Class Range', value: info.range },
    { label: 'Binary Representation', value: info.binary, mono: true },
  ] : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IPv4 Address</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="192.168.1.1"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={analyze} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors">Analyze</button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

      {info && (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {rows.map((row, i) => (
              <div key={row.label} className={`flex justify-between items-start px-4 py-2.5 ${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">{row.label}</span>
                <span className={`text-sm font-medium text-gray-900 dark:text-gray-100 text-right ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
              </div>
            ))}
          </div>
          {info.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-3 text-sm text-blue-700 dark:text-blue-400">
              ℹ {info.notes}
            </div>
          )}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Octet Breakdown</p>
            <div className="flex gap-2 justify-center">
              {info.octets.map((oct, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{oct}</div>
                  <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{oct.toString(2).padStart(8, '0')}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Octet {i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
