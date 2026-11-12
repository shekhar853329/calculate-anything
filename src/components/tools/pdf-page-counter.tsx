import { useState } from 'react';

export default function PdfPageCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [fileSize, setFileSize] = useState(0);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    setCount(null);
    setStatus('Counting pages…');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setCount(doc.getPageCount());
      setStatus('');
    } catch {
      setStatus('Error: Could not read the PDF file. Make sure it is a valid PDF.');
    }
  }

  const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Upload PDF File</label>
        <input type="file" accept="application/pdf" onChange={handleFile}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {status && <p className="text-sm text-gray-600 dark:text-gray-400">{status}</p>}

      {count !== null && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center space-y-2">
          <p className="text-sm text-gray-500">{fileName}</p>
          <p className="text-sm text-gray-400">{fmtSize(fileSize)}</p>
          <div className="text-5xl font-bold text-blue-600">{count}</div>
          <p className="text-gray-600 dark:text-gray-400">{count === 1 ? 'Page' : 'Pages'}</p>
        </div>
      )}
    </div>
  );
}
