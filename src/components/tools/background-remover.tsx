import { useState, useRef } from 'react';

// Client-side background removal using flood fill on the canvas
// A simplified tolerance-based approach without external ML models
export default function BackgroundRemover() {
  const [src, setSrc] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState(30);
  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('image');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    setSrc(URL.createObjectURL(file));
    setResult(null);
    setStatus('');
  }

  function removeBackground() {
    if (!src || !canvasRef.current) return;
    setStatus('Processing…');
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;

      // Sample background color from corners
      function getPixel(x: number, y: number) {
        const i = (y * width + x) * 4;
        return [data[i], data[i + 1], data[i + 2], data[i + 3]];
      }

      const corners = [getPixel(0, 0), getPixel(width - 1, 0), getPixel(0, height - 1), getPixel(width - 1, height - 1)];
      const bgColor = corners.reduce((a, b) => a.map((v, i) => (v + b[i]) / 2));

      function colorDiff(r: number, g: number, b: number) {
        return Math.sqrt(
          Math.pow(r - bgColor[0], 2) + Math.pow(g - bgColor[1], 2) + Math.pow(b - bgColor[2], 2)
        );
      }

      for (let i = 0; i < data.length; i += 4) {
        const diff = colorDiff(data[i], data[i + 1], data[i + 2]);
        if (diff < tolerance) {
          data[i + 3] = 0; // transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
      setStatus('Done! Download the PNG with transparent background.');
    };
    img.src = src;
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-200">
        This tool removes solid-colored backgrounds using corner-color sampling. Works best with uniform backgrounds (white, solid colors).
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {src && (
        <>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Tolerance: {tolerance} (higher = remove more)</label>
            <input type="range" min={5} max={100} value={tolerance}
              onChange={e => setTolerance(Number(e.target.value))}
              className="w-full accent-blue-500" />
          </div>

          <button onClick={removeBackground}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            Remove Background
          </button>

          {status && <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <img src={src} alt="Original" className="max-h-48 mx-auto rounded border" />
              <p className="text-xs mt-1 text-gray-500">Original</p>
            </div>
            {result && (
              <div className="text-center">
                <img src={result} alt="Result" className="max-h-48 mx-auto rounded border bg-checkerboard" style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 20px 20px' }} />
                <p className="text-xs mt-1 text-gray-500">Result (transparent)</p>
                <a href={result} download={`${fileName}_no_bg.png`}
                  className="mt-1 inline-block px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                  Download PNG
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
