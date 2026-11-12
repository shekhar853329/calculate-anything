import { useState } from 'react';

interface MetaEntry { label: string; value: string }

export default function ImageMetadataViewer() {
  const [meta, setMeta] = useState<MetaEntry[]>([]);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMeta([]);
    setStatus('Reading metadata…');
    setPreview(URL.createObjectURL(file));

    const basic: MetaEntry[] = [
      { label: 'File Name', value: file.name },
      { label: 'File Size', value: file.size > 1048576 ? `${(file.size / 1048576).toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB` },
      { label: 'MIME Type', value: file.type || 'Unknown' },
      { label: 'Last Modified', value: new Date(file.lastModified).toLocaleString() },
    ];

    // Get image dimensions
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      basic.push({ label: 'Dimensions', value: `${img.naturalWidth} × ${img.naturalHeight} px` });
      basic.push({ label: 'Aspect Ratio', value: `${(img.naturalWidth / img.naturalHeight).toFixed(3)}:1` });

      try {
        const exifr = (await import('exifr')).default;
        const exif = await exifr.parse(file, { tiff: true, exif: true, gps: true, icc: false });
        if (exif) {
          if (exif.Make) basic.push({ label: 'Camera Make', value: exif.Make });
          if (exif.Model) basic.push({ label: 'Camera Model', value: exif.Model });
          if (exif.DateTimeOriginal) basic.push({ label: 'Date Taken', value: new Date(exif.DateTimeOriginal).toLocaleString() });
          if (exif.ExposureTime) basic.push({ label: 'Exposure', value: `1/${Math.round(1 / exif.ExposureTime)}s` });
          if (exif.FNumber) basic.push({ label: 'Aperture', value: `f/${exif.FNumber}` });
          if (exif.ISO) basic.push({ label: 'ISO', value: String(exif.ISO) });
          if (exif.FocalLength) basic.push({ label: 'Focal Length', value: `${exif.FocalLength}mm` });
          if (exif.GPSLatitude && exif.GPSLongitude) {
            basic.push({ label: 'GPS Location', value: `${exif.GPSLatitude.toFixed(6)}, ${exif.GPSLongitude.toFixed(6)}` });
          }
          if (exif.Software) basic.push({ label: 'Software', value: exif.Software });
          if (exif.ColorSpace) basic.push({ label: 'Color Space', value: String(exif.ColorSpace) });
        }
      } catch {
        // exifr failed — basic info only
      }

      setMeta(basic);
      setStatus('');
    };
    img.onerror = () => {
      setMeta(basic);
      setStatus('');
    };
    img.src = url;
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {status && <p className="text-sm text-blue-600">{status}</p>}

      {preview && meta.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <img src={preview} alt="Preview" className="max-h-48 rounded-lg border object-contain w-full" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {meta.map(m => (
                  <tr key={m.label} className="border-b dark:border-gray-700">
                    <td className="py-2 pr-3 font-medium text-gray-500 whitespace-nowrap">{m.label}</td>
                    <td className="py-2 break-all">{m.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
