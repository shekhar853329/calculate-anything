import { useState, useRef } from 'react';

export default function JpgToPngConverter() {
  const [src, setSrc] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('image');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.(jpg|jpeg)$/i, ''));
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
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />
      <div>
        <label className="block text-sm font-medium mb-1">Upload JPG / JPEG</label>
        <input type="file" accept="image/jpeg" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      {src && (
        <>
          <button onClick={convert}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            Convert to PNG
          </button>
          {result && (
            <div className="text-center">
              <img src={result} alt="PNG" className="max-h-48 mx-auto rounded border mb-2" />
              <a href={result} download={`${fileName}.png`}
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
