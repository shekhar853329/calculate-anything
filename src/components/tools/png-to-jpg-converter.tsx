import { useState, useRef } from 'react';

export default function PngToJpgConverter() {
  const [src, setSrc] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('image');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.png$/i, ''));
    setSrc(URL.createObjectURL(file));
    setResult(null);
  }

  function convert() {
    if (!src || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/jpeg', quality / 100));
    };
    img.src = src;
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />
      <div>
        <label className="block text-sm font-medium mb-1">Upload PNG</label>
        <input type="file" accept="image/png" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      {src && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">JPEG Quality: {quality}%</label>
              <input type="range" min={10} max={100} value={quality}
                onChange={e => setQuality(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                className="h-10 w-full border rounded-lg cursor-pointer" />
            </div>
          </div>
          <button onClick={convert}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            Convert to JPG
          </button>
          {result && (
            <div className="text-center">
              <img src={result} alt="JPEG" className="max-h-48 mx-auto rounded border mb-2" />
              <a href={result} download={`${fileName}.jpg`}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                Download JPG
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
