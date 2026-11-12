import { useState } from 'react';

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    setResultUrl(null);
    setStatus('');
  }

  async function merge() {
    if (files.length < 2) { setStatus('Please select at least 2 PDF files.'); return; }
    setStatus('Merging…');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setStatus(`Merged ${files.length} PDFs successfully.`);
    } catch {
      setStatus('Error merging PDFs. Ensure all files are valid PDFs.');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Select PDF Files (hold Ctrl/Cmd to select multiple)</label>
        <input type="file" accept="application/pdf" multiple onChange={handleFiles}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {files.length > 0 && (
        <ul className="text-sm space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-gray-400">#{i + 1}</span> {f.name}
              <span className="text-xs text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span>
            </li>
          ))}
        </ul>
      )}

      <button onClick={merge} disabled={files.length < 2}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium">
        Merge PDFs
      </button>

      {status && <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>}

      {resultUrl && (
        <a href={resultUrl} download="merged.pdf"
          className="inline-block px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
          Download Merged PDF
        </a>
      )}
    </div>
  );
}
