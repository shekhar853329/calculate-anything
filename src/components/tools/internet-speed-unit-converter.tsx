import { useState } from 'react';

// All units relative to bits per second
const UNITS = [
  { label: 'bps (bits/sec)', key: 'bps', factor: 1 },
  { label: 'Kbps (kilobits/sec)', key: 'kbps', factor: 1e3 },
  { label: 'Mbps (megabits/sec)', key: 'mbps', factor: 1e6 },
  { label: 'Gbps (gigabits/sec)', key: 'gbps', factor: 1e9 },
  { label: 'B/s (bytes/sec)', key: 'bps_B', factor: 8 },
  { label: 'KB/s (kilobytes/sec)', key: 'kbps_B', factor: 8e3 },
  { label: 'MB/s (megabytes/sec)', key: 'mbps_B', factor: 8e6 },
  { label: 'GB/s (gigabytes/sec)', key: 'gbps_B', factor: 8e9 },
];

function fmt(n: number): string {
  if (n === 0) return '0';
  if (n >= 1e12 || (n < 0.0001 && n > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(6)).toLocaleString('en-US', { maximumSignificantDigits: 6 });
}

export default function InternetSpeedUnitConverter() {
  const [value, setValue] = useState('100');
  const [from, setFrom] = useState('mbps');

  const fromUnit = UNITS.find(u => u.key === from)!;
  const bps = parseFloat(value) * fromUnit.factor;
  const valid = !isNaN(bps) && isFinite(bps) && parseFloat(value) >= 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Value</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} min={0}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">From Unit</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700">
            {UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
      </div>

      {valid && (
        <>
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Equivalent Speeds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UNITS.map(u => {
              const converted = bps / u.factor;
              const isSource = u.key === from;
              return (
                <div key={u.key}
                  className={`flex justify-between items-center px-4 py-3 rounded-xl border ${isSource ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{u.label}</span>
                  <span className={`font-mono font-bold text-sm ${isSource ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                    {fmt(converted)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm">
            <p className="text-blue-800 dark:text-blue-200">
              💡 <strong>Download time for 1 GB:</strong>{' '}
              {bps > 0 ? `${(8e9 / bps).toFixed(1)} seconds (${(8e9 / bps / 60).toFixed(2)} minutes)` : 'N/A'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
