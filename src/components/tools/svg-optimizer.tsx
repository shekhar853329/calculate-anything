import React, { useState, useCallback } from 'react';

function optimizeSVG(svg: string): string {
  let result = svg;

  // Remove XML declaration
  result = result.replace(/<\?xml[^?]*\?>\s*/gi, '');
  // Remove comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  // Remove DOCTYPE
  result = result.replace(/<!DOCTYPE[^>]*>/gi, '');
  // Remove unnecessary whitespace between tags
  result = result.replace(/>\s+</g, '><');
  // Remove leading/trailing whitespace from attribute values
  result = result.replace(/\s*=\s*"/g, '="');
  // Remove empty style attributes
  result = result.replace(/\s+style=""/g, '');
  // Remove empty class attributes
  result = result.replace(/\s+class=""/g, '');
  // Remove data- attributes
  result = result.replace(/\s+data-[a-z-]+="[^"]*"/g, '');
  // Remove id attributes on non-referenced elements (simple heuristic: standalone IDs)
  result = result.replace(/\s+id="[^"]*"/g, '');
  // Remove unnecessary xmlns:xlink (deprecated)
  result = result.replace(/\s+xmlns:xlink="[^"]*"/g, '');
  // Remove version attribute
  result = result.replace(/\s+version="[^"]*"/g, '');
  // Compress multiple spaces in attributes
  result = result.replace(/  +/g, ' ');
  // Remove newlines and extra whitespace
  result = result.replace(/\n\s*/g, ' ').trim();

  return result;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SvgOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const beforeSize = new TextEncoder().encode(input).length;
  const afterSize = output ? new TextEncoder().encode(output).length : 0;
  const savings = beforeSize > 0 && afterSize > 0 ? ((1 - afterSize / beforeSize) * 100).toFixed(1) : null;

  const optimize = useCallback(() => {
    if (!input.trim()) return;
    setOutput(optimizeSVG(input));
  }, [input]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const download = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const reset = useCallback(() => { setInput(''); setOutput(''); }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SVG Input</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={10}
          placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
        {input && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Size: {formatBytes(beforeSize)}</p>}
      </div>

      <div className="flex gap-3">
        <button onClick={optimize} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">Optimize</button>
        <button onClick={reset} className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Reset</button>
      </div>

      {output && (
        <div className="space-y-3">
          {savings && (
            <div className="flex gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
                <span className="text-gray-500 dark:text-gray-400">Before: </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatBytes(beforeSize)}</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2">
                <span className="text-gray-500 dark:text-gray-400">After: </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatBytes(afterSize)}</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-2">
                <span className="text-green-700 dark:text-green-400 font-medium">Saved {savings}%</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Optimized SVG</label>
            <textarea
              readOnly
              value={output}
              rows={6}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono resize-y"
            />
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</p>
            <div
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white flex items-center justify-center min-h-24"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
            <button onClick={download} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
              Download SVG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
