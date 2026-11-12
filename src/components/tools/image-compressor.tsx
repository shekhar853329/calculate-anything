import { useState, useRef } from 'react';

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal({ url, size: file.size, name: file.name });
    setCompressed(null);
  }

  function compress() {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setCompressed({ url, size: blob.size });
      }, 'image/jpeg', quality / 100);
    };
    img.src = original.url;
  }

  const savings = original && compressed
    ? (((original.size - compressed.size) / original.size) * 100).toFixed(1)
    : null;

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      <div>
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300" />
      </div>

      {original && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Quality: {quality}%</label>
            <input type="range" min={10} max={100} value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="w-full accent-blue-500" />
          </div>

          <div className="flex gap-3">
            <button onClick={compress}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
              Compress
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
              <img src={original.url} alt="Original" className="max-h-40 mx-auto object-contain mb-2 rounded" />
              <p className="text-sm font-medium">Original</p>
              <p className="text-xs text-gray-500">{fmtSize(original.size)}</p>
            </div>
            {compressed && (
              <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4 text-center">
                <img src={compressed.url} alt="Compressed" className="max-h-40 mx-auto object-contain mb-2 rounded" />
                <p className="text-sm font-medium text-green-700">Compressed</p>
                <p className="text-xs text-gray-500">{fmtSize(compressed.size)}</p>
                <p className="text-xs text-green-600 font-medium">{savings}% smaller</p>
                <a href={compressed.url} download={`compressed_${original.name}`}
                  className="mt-2 inline-block px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                  Download
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
