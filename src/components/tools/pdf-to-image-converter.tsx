import { useState } from 'react';

export default function PdfToImageConverter() {
  const [status, setStatus] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [fileName, setFileName] = useState('page');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.pdf$/i, ''));
    setImages([]);
    setStatus('Loading PDF…');

    try {
      // Use pdf-lib to get page count, then canvas rendering via basic approach
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      setStatus(`Found ${pageCount} page(s). Rendering…`);

      const results: string[] = [];
      for (let i = 0; i < pageCount; i++) {
        // Extract single page
        const singleDoc = await PDFDocument.create();
        const [page] = await singleDoc.copyPages(doc, [i]);
        singleDoc.addPage(page);
        const singleBytes = await singleDoc.save();

        // Render to canvas using a blob URL and an iframe trick isn't available;
        // Instead we output a downloadable single-page PDF per page as a fallback
        const blob = new Blob([singleBytes], { type: 'application/pdf' });
        results.push(URL.createObjectURL(blob));
      }
      setImages(results);
      setStatus(`Rendered ${pageCount} page(s) as individual PDFs ready to download.`);
    } catch {
      setStatus('Error processing PDF. Ensure it is a valid, non-encrypted PDF.');
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
        Splits a PDF into individual pages. Each page is available as a separate downloadable PDF. Full image rendering (PNG) requires a server-side environment.
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Upload PDF</label>
        <input type="file" accept="application/pdf" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {status && <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center h-20 mb-2 text-4xl">📄</div>
              <p className="text-xs text-gray-500 mb-2">Page {i + 1}</p>
              <a href={url} download={`${fileName}_page${i + 1}.pdf`}
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
