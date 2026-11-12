import { useState } from 'react';

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState('');
  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    setStatus('Loading…');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
      setStatus(`Loaded: ${doc.getPageCount()} pages`);
    } catch {
      setStatus('Error loading PDF.');
    }
  }

  function parseRange(input: string, max: number): number[] {
    const pages: number[] = [];
    input.split(',').forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [a, b] = trimmed.split('-').map(Number);
        for (let i = a; i <= Math.min(b, max); i++) pages.push(i - 1);
      } else {
        const n = parseInt(trimmed);
        if (!isNaN(n) && n >= 1 && n <= max) pages.push(n - 1);
      }
    });
    return [...new Set(pages)].sort((a, b) => a - b);
  }

  async function split() {
    if (!file || !range) return;
    setStatus('Extracting…');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const dest = await PDFDocument.create();
      const indices = parseRange(range, pageCount);
      if (!indices.length) { setStatus('No valid pages in range.'); return; }
      const copied = await dest.copyPages(src, indices);
      copied.forEach(p => dest.addPage(p));
      const out = await dest.save();
      const blob = new Blob([out], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setStatus(`Extracted ${indices.length} page(s).`);
    } catch {
      setStatus('Error splitting PDF.');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Upload PDF</label>
        <input type="file" accept="application/pdf" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {pageCount > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Page Range (e.g. 1-3,5,7-9)</label>
          <input type="text" value={range} onChange={e => setRange(e.target.value)}
            placeholder={`1-${pageCount}`}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700" />
        </div>
      )}

      <button onClick={split} disabled={!file || !range}
        className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium">
        Extract Pages
      </button>

      {status && <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>}

      {resultUrl && (
        <a href={resultUrl} download="extracted.pdf"
          className="inline-block px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">
          Download Extracted PDF
        </a>
      )}
    </div>
  );
}
