import React, { useState, useCallback } from 'react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hue2rgb(hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(hn) * 255),
    b: Math.round(hue2rgb(hn - 1 / 3) * 255),
  };
}

type ColorResult = { hex: string; rgb: string; hsl: string; preview: string };

function convertFromHex(hex: string): ColorResult | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { hex, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, preview: hex };
}

function convertFromRgb(rgb: string): ColorResult | null {
  const m = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (!m) return null;
  const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  return { hex, rgb, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, preview: hex };
}

function convertFromHsl(hsl: string): ColorResult | null {
  const m = hsl.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
  if (!m) return null;
  const h = parseInt(m[1]), s = parseInt(m[2]), l = parseInt(m[3]);
  const { r, g, b } = hslToRgb(h, s, l);
  const hex = rgbToHex(r, g, b);
  return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl, preview: hex };
}

export default function ColorCodeConverter() {
  const [input, setInput] = useState('#3b82f6');
  const [result, setResult] = useState<ColorResult | null>(convertFromHex('#3b82f6'));
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const convert = useCallback((val: string) => {
    setInput(val);
    setError('');
    const trimmed = val.trim();
    let res: ColorResult | null = null;
    if (trimmed.startsWith('#')) res = convertFromHex(trimmed);
    else if (/^rgb/i.test(trimmed)) res = convertFromRgb(trimmed);
    else if (/^hsl/i.test(trimmed)) res = convertFromHsl(trimmed);
    else if (/^[0-9a-f]{3,6}$/i.test(trimmed)) res = convertFromHex('#' + trimmed);

    if (res) setResult(res);
    else if (trimmed) setError('Invalid color format. Use #hex, rgb(), or hsl()');
  }, []);

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color Input</label>
          <input
            type="text"
            value={input}
            onChange={e => convert(e.target.value)}
            placeholder="#3b82f6 or rgb(59,130,246) or hsl(217,91%,60%)"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          type="color"
          value={result?.hex || '#3b82f6'}
          onChange={e => convert(e.target.value)}
          className="h-11 w-14 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer p-1 bg-white dark:bg-gray-800"
          title="Color picker"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {result && (
        <div className="space-y-3">
          <div
            className="w-full h-24 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            style={{ backgroundColor: result.preview }}
          />
          {[
            { label: 'HEX', key: 'hex', value: result.hex },
            { label: 'RGB', key: 'rgb', value: result.rgb },
            { label: 'HSL', key: 'hsl', value: result.hsl },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-3">{item.label}</span>
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100">{item.value}</code>
              </div>
              <button onClick={() => copy(item.key, item.value)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-4">
                {copiedKey === item.key ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
