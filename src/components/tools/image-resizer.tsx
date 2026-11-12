import { useState, useRef } from 'react';

export default function ImageResizer() {
  const [src, setSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lock, setLock] = useState(true);
  const [mode, setMode] = useState<'px' | 'pct'>('px');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('image');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      setSrc(url);
      setResult(null);
    };
    img.src = url;
  }

  function handleWidthChange(val: string) {
    setWidth(val);
    if (lock && origW && origH) {
      const w = parseFloat(val);
      if (!isNaN(w)) {
        const ratio = origH / origW;
        setHeight(mode === 'px' ? String(Math.round(w * ratio)) : String(w.toFixed(1)));
      }
    }
  }

  function resize() {
    if (!src || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const targetW = mode === 'px' ? parseFloat(width) : (origW * parseFloat(width)) / 100;
      const targetH = mode === 'px' ? parseFloat(height) : (origH * parseFloat(height)) / 100;
      const canvas = canvasRef.current!;
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.getContext('2d')!.drawImage(img, 0, 0, targetW, targetH);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      <div>
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {src && (
        <>
          <div className="flex gap-3 items-center">
            <label className="text-sm font-medium">Mode:</label>
            {(['px', 'pct'] as const).map(m => (
              <label key={m} className="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" value={m} checked={mode === m} onChange={() => setMode(m)} className="accent-blue-500" />
                {m === 'px' ? 'Pixels' : 'Percentage'}
              </label>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <div>
              <label className="block text-xs mb-1">Width ({mode})</label>
              <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)}
                className="w-28 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <button onClick={() => setLock(!lock)} title="Lock aspect ratio"
              className={`mt-4 px-2 py-2 rounded-lg border ${lock ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 dark:bg-gray-700'}`}>
              {lock ? '🔒' : '🔓'}
            </button>
            <div>
              <label className="block text-xs mb-1">Height ({mode})</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} disabled={lock}
                className="w-28 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50" />
            </div>
          </div>

          <p className="text-xs text-gray-400">Original: {origW} × {origH} px</p>

          <button onClick={resize}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            Resize Image
          </button>

          {result && (
            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 text-center">
              <img src={result} alt="Resized" className="max-h-48 mx-auto rounded mb-3" />
              <a href={result} download={`resized_${fileName}`}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                Download PNG
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
