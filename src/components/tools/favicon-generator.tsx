import { useState } from 'react';

const SIZES = [16, 32, 48, 64, 128, 180, 192];

export default function FaviconGenerator() {
  const [src, setSrc] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<{ size: number; url: string }[]>([]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSrc(URL.createObjectURL(file));
    setOutputs([]);
  }

  function generate() {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const result = SIZES.map(size => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.getContext('2d')!.drawImage(img, 0, 0, size, size);
        return { size, url: canvas.toDataURL('image/png') };
      });
      setOutputs(result);
    };
    img.src = src;
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Upload Image (square recommended)</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {src && (
        <button onClick={generate}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
          Generate Favicons
        </button>
      )}

      {outputs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {outputs.map(o => (
            <div key={o.size} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center h-16 mb-2"
                style={{ background: 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 0 / 10px 10px' }}>
                <img src={o.url} alt={`${o.size}px`} style={{ width: o.size > 64 ? 64 : o.size }} className="rounded" />
              </div>
              <p className="text-xs text-gray-500 mb-1">{o.size} × {o.size} px</p>
              <a href={o.url} download={`favicon-${o.size}.png`}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
