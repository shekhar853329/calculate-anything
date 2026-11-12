import { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropper() {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [result, setResult] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [fileName, setFileName] = useState('image');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
    setCrop(undefined);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const c = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height), width, height);
    setCrop(c);
  }

  function cropImage() {
    if (!imgRef.current || !crop) return;
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = (crop.width / 100) * img.naturalWidth;
    canvas.height = (crop.height / 100) * img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      img,
      (crop.x / 100) * img.naturalWidth,
      (crop.y / 100) * img.naturalHeight,
      canvas.width,
      canvas.height,
      0, 0,
      canvas.width,
      canvas.height
    );
    setResult(canvas.toDataURL('image/png'));
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {src && (
        <>
          <div className="overflow-auto">
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
              <img ref={imgRef} src={src} onLoad={onImageLoad} alt="Crop source"
                className="max-w-full" />
            </ReactCrop>
          </div>

          <button onClick={cropImage}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
            Crop Image
          </button>

          {result && (
            <div className="text-center">
              <img src={result} alt="Cropped" className="max-h-48 mx-auto rounded border mb-2" />
              <a href={result} download={`cropped_${fileName}.png`}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                Download Cropped PNG
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
