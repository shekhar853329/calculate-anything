import { useState, useRef } from 'react';

export default function QrCodeScanner() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setError('');
    setStatus('Scanning…');

    const img = new Image();
    img.onload = async () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      try {
        const jsQR = (await import('jsqr')).default;
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setResult(code.data);
          setStatus('QR code decoded successfully.');
        } else {
          setError('No QR code found in the image. Try a clearer image.');
          setStatus('');
        }
      } catch {
        setError('Failed to scan image.');
        setStatus('');
      }
    };
    img.src = URL.createObjectURL(file);
  }

  function copy() {
    if (result) navigator.clipboard.writeText(result);
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      <div>
        <label className="block text-sm font-medium mb-1">Upload QR Code Image</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {status && <p className="text-sm text-blue-600">{status}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-green-800 dark:text-green-200">Decoded Content</h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 font-mono text-sm break-all">
            {result}
          </div>
          <div className="flex gap-2">
            <button onClick={copy}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
              Copy
            </button>
            {result.startsWith('http') && (
              <a href={result} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                Open URL
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
