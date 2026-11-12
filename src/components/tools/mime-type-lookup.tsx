import React, { useState, useMemo } from 'react';

type MimeEntry = { ext: string[]; mime: string; description: string };

const MIME_DB: MimeEntry[] = [
  { ext: ['html', 'htm'], mime: 'text/html', description: 'HTML Document' },
  { ext: ['css'], mime: 'text/css', description: 'Cascading Style Sheet' },
  { ext: ['js', 'mjs'], mime: 'text/javascript', description: 'JavaScript' },
  { ext: ['json'], mime: 'application/json', description: 'JSON Data' },
  { ext: ['xml'], mime: 'application/xml', description: 'XML Document' },
  { ext: ['csv'], mime: 'text/csv', description: 'CSV Spreadsheet' },
  { ext: ['txt'], mime: 'text/plain', description: 'Plain Text' },
  { ext: ['md'], mime: 'text/markdown', description: 'Markdown Document' },
  { ext: ['pdf'], mime: 'application/pdf', description: 'PDF Document' },
  { ext: ['zip'], mime: 'application/zip', description: 'ZIP Archive' },
  { ext: ['tar'], mime: 'application/x-tar', description: 'TAR Archive' },
  { ext: ['gz'], mime: 'application/gzip', description: 'GZIP Archive' },
  { ext: ['7z'], mime: 'application/x-7z-compressed', description: '7-Zip Archive' },
  { ext: ['rar'], mime: 'application/vnd.rar', description: 'RAR Archive' },
  { ext: ['png'], mime: 'image/png', description: 'PNG Image' },
  { ext: ['jpg', 'jpeg'], mime: 'image/jpeg', description: 'JPEG Image' },
  { ext: ['gif'], mime: 'image/gif', description: 'GIF Image' },
  { ext: ['webp'], mime: 'image/webp', description: 'WebP Image' },
  { ext: ['svg'], mime: 'image/svg+xml', description: 'SVG Image' },
  { ext: ['ico'], mime: 'image/x-icon', description: 'Icon File' },
  { ext: ['bmp'], mime: 'image/bmp', description: 'Bitmap Image' },
  { ext: ['tiff', 'tif'], mime: 'image/tiff', description: 'TIFF Image' },
  { ext: ['avif'], mime: 'image/avif', description: 'AVIF Image' },
  { ext: ['mp3'], mime: 'audio/mpeg', description: 'MP3 Audio' },
  { ext: ['wav'], mime: 'audio/wav', description: 'WAV Audio' },
  { ext: ['ogg'], mime: 'audio/ogg', description: 'OGG Audio' },
  { ext: ['aac'], mime: 'audio/aac', description: 'AAC Audio' },
  { ext: ['flac'], mime: 'audio/flac', description: 'FLAC Audio' },
  { ext: ['mp4'], mime: 'video/mp4', description: 'MP4 Video' },
  { ext: ['webm'], mime: 'video/webm', description: 'WebM Video' },
  { ext: ['avi'], mime: 'video/x-msvideo', description: 'AVI Video' },
  { ext: ['mov'], mime: 'video/quicktime', description: 'QuickTime Video' },
  { ext: ['mkv'], mime: 'video/x-matroska', description: 'MKV Video' },
  { ext: ['doc'], mime: 'application/msword', description: 'Microsoft Word' },
  { ext: ['docx'], mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Word Document (OOXML)' },
  { ext: ['xls'], mime: 'application/vnd.ms-excel', description: 'Microsoft Excel' },
  { ext: ['xlsx'], mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Excel Spreadsheet (OOXML)' },
  { ext: ['ppt'], mime: 'application/vnd.ms-powerpoint', description: 'Microsoft PowerPoint' },
  { ext: ['pptx'], mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', description: 'PowerPoint (OOXML)' },
  { ext: ['ttf'], mime: 'font/ttf', description: 'TrueType Font' },
  { ext: ['otf'], mime: 'font/otf', description: 'OpenType Font' },
  { ext: ['woff'], mime: 'font/woff', description: 'Web Open Font Format' },
  { ext: ['woff2'], mime: 'font/woff2', description: 'Web Open Font Format 2' },
  { ext: ['ts'], mime: 'video/mp2t', description: 'MPEG Transport Stream' },
  { ext: ['wasm'], mime: 'application/wasm', description: 'WebAssembly Binary' },
  { ext: ['rtf'], mime: 'application/rtf', description: 'Rich Text Format' },
  { ext: ['sh'], mime: 'application/x-sh', description: 'Shell Script' },
  { ext: ['sql'], mime: 'application/sql', description: 'SQL Script' },
  { ext: ['py'], mime: 'text/x-python', description: 'Python Source' },
  { ext: ['java'], mime: 'text/x-java-source', description: 'Java Source' },
  { ext: ['c', 'cpp'], mime: 'text/x-c', description: 'C/C++ Source' },
];

export default function MimeTypeLookup() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\./, '');
    if (!q) return MIME_DB;
    return MIME_DB.filter(e =>
      e.ext.some(x => x.includes(q)) ||
      e.mime.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by extension or MIME type</label>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. jpg, application/json, pdf..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</p>
      <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-left">
              <th className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 w-24">Extension</th>
              <th className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300">MIME Type</th>
              <th className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 hidden sm:table-cell">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-2.5 font-mono text-xs text-blue-600 dark:text-blue-400">.{e.ext.join(', .')}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-gray-800 dark:text-gray-200">{e.mime}</td>
                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{e.description}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
