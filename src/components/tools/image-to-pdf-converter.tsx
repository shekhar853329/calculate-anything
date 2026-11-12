import { useState } from 'react';

export default function ImageToPdfConverter() {
  const [status, setStatus] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('image');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    setStatus('Converting…');
    setPdfUrl(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const imgBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.create();

      let img;
      if (file.type === 'image/png') {
        img = await pdfDoc.embedPng(imgBytes);
      } else {
        img = await pdfDoc.embedJpg(imgBytes);
      }

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      setStatus('Done!');
    } catch {
      setStatus('Error: could not convert image. Make sure it is a valid JPG or PNG.');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Upload Image (JPG or PNG)</label>
        <input type="file" accept="image/jpeg,image/png" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {status && <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>}

      {pdfUrl && (
        <a href={pdfUrl} download={`${fileName}.pdf`}
          className="inline-block px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
          Download PDF
        </a>
      )}
    </div>
  );
}
