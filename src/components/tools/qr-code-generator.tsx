import React, { useState, useCallback, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim()) { setError('Please enter text or URL.'); return; }
    setError('');
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      await QRCode.toCanvas(canvas, text, {
        width: size,
        errorCorrectionLevel: ecLevel,
        color: { dark: fgColor, light: bgColor },
      });
    } catch (e: any) {
      setError(`Failed to generate QR code: ${e.message}`);
    }
  }, [text, size, ecLevel, fgColor, bgColor]);

  useEffect(() => { generate(); }, [generate]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text or URL</label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Size (px)</label>
          <input type="number" min={128} max={1024} step={64} value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Error Correction</label>
          <select value={ecLevel} onChange={e => setEcLevel(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="L">L (7%)</option>
            <option value="M">M (15%)</option>
            <option value="Q">Q (25%)</option>
            <option value="H">H (30%)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Foreground</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5">
            <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0" />
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{fgColor}</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Background</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5">
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-6 w-6 rounded cursor-pointer border-0" />
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{bgColor}</span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>}

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white inline-block">
          <canvas ref={canvasRef} />
        </div>
        <button onClick={download} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
          Download PNG
        </button>
      </div>
    </div>
  );
}
