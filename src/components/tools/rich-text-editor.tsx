import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
  Copy,
  Check,
  Download,
  Trash2,
  FileCode,
  FileText,
  RotateCcw,
  Sparkles,
  FileEdit,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const SAMPLE_CONTENT = `<h2>Welcome to the Offline Rich Text Editor</h2>
<p>This is a full-featured <strong>WYSIWYG editor</strong> powered by the open-source community edition of <strong>TinyMCE</strong>. It runs <em>100% client-side in your browser</em> with zero external API calls or tracking.</p>

<h3>Key Features Available</h3>
<ul>
  <li><strong>Full Typography & Formatting:</strong> Custom fonts, headings, font sizing, colors, highlighting, and strikethrough.</li>
  <li><strong>Tables & Structured Data:</strong> Insert and edit rich tables with custom cell styles and headers.</li>
  <li><strong>Media & Code:</strong> Embed images, video embeds, quotes, and syntax-highlighted code samples.</li>
  <li><strong>Complete Tools Suite:</strong> Accordions, emoticons, word counter, search & replace, visual blocks, and full-screen distraction-free mode.</li>
</ul>

<table style="border-collapse: collapse; width: 100%; border: 1px solid #cbd5e1;" border="1">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="padding: 8px; text-align: left;">Feature</th>
      <th style="padding: 8px; text-align: left;">Mode</th>
      <th style="padding: 8px; text-align: left;">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px;">TinyMCE Engine</td>
      <td style="padding: 8px;">Open Source Core</td>
      <td style="padding: 8px;">✅ Offline Ready</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Privacy & Security</td>
      <td style="padding: 8px;">Local in-browser</td>
      <td style="padding: 8px;">🔒 100% Private</td>
    </tr>
  </tbody>
</table>

<p>Feel free to edit this text, format your document, or click <strong>Clear</strong> to start from a blank page!</p>`;

export default function RichTextEditor() {
  const { theme } = useTheme();
  const contentRef = useRef<string>(SAMPLE_CONTENT);
  const [mounted, setMounted] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [stats, setStats] = useState({ words: 0, chars: 0, readingTime: 0 });
  const editorRef = useRef<any>(null);

  // Determine dark mode
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const dark =
      document.documentElement.classList.contains('dark') ||
      theme === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(dark);

    // Observer for dark mode changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [theme]);

  // Update statistics from editor text
  const updateStats = useCallback((editor: any) => {
    if (!editor) return;
    try {
      const text = editor.getContent({ format: 'text' }) || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const readingTime = Math.ceil(words / 200);
      setStats({ words, chars, readingTime });
    } catch {
      // Ignore if editor not ready
    }
  }, []);

  const handleEditorChange = (newContent: string, editor: any) => {
    contentRef.current = newContent;
    updateStats(editor);
  };

  const handleCopyHtml = () => {
    const htmlToCopy = editorRef.current ? editorRef.current.getContent() : contentRef.current;
    navigator.clipboard.writeText(htmlToCopy).then(() => {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    });
  };

  const handleCopyText = () => {
    const plainText = editorRef.current
      ? editorRef.current.getContent({ format: 'text' })
      : contentRef.current.replace(/<[^>]+>/g, '');
    navigator.clipboard.writeText(plainText).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const handleDownload = (format: 'html' | 'txt') => {
    const data =
      format === 'html'
        ? editorRef.current
          ? editorRef.current.getContent()
          : contentRef.current
        : editorRef.current
          ? editorRef.current.getContent({ format: 'text' })
          : contentRef.current.replace(/<[^>]+>/g, '');

    const blob = new Blob([data], {
      type: format === 'html' ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.setContent('');
      contentRef.current = '';
      updateStats(editorRef.current);
    }
  };

  const handleLoadSample = () => {
    if (editorRef.current) {
      editorRef.current.setContent(SAMPLE_CONTENT);
      contentRef.current = SAMPLE_CONTENT;
      updateStats(editorRef.current);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-gray-850 p-3 sm:p-3.5 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            title="Copy raw HTML markup"
          >
            {copiedHtml ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
            )}
            <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            title="Copy as plain text"
          >
            {copiedText ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span>{copiedText ? 'Copied Text' : 'Copy Text'}</span>
          </button>

          <button
            onClick={() => handleDownload('html')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            title="Download as HTML document"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export HTML</span>
          </button>

          <button
            onClick={() => handleDownload('txt')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            title="Download as plain text file"
          >
            <Download className="w-3.5 h-3.5 text-teal-500" />
            <span>Export TXT</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            title="Restore sample text"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample</span>
          </button>

          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200/80 dark:border-red-900/60 bg-red-50/70 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors"
            title="Clear all content"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="bg-white dark:bg-gray-850 rounded-2xl border border-gray-200/90 dark:border-gray-800 overflow-hidden shadow-sm">
        {mounted ? (
          <Editor
            key={isDark ? 'tinymce-dark' : 'tinymce-light'}
            licenseKey="gpl"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              updateStats(editor);
            }}
            initialValue={SAMPLE_CONTENT}
            onEditorChange={handleEditorChange}
            init={{
              license_key: 'gpl',
              base_url: '/tinymce',
              suffix: '.min',
              height: 580,
              menubar: 'file edit view insert format tools table help',
              plugins: [
                'accordion',
                'advlist',
                'anchor',
                'autolink',
                'charmap',
                'code',
                'codesample',
                'directionality',
                'emoticons',
                'fullscreen',
                'help',
                'image',
                'importcss',
                'insertdatetime',
                'link',
                'lists',
                'media',
                'nonbreaking',
                'pagebreak',
                'preview',
                'quickbars',
                'save',
                'searchreplace',
                'table',
                'visualblocks',
                'visualchars',
                'wordcount',
              ],
              toolbar: [
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify',
                'bullist numlist outdent indent | link image media table codesample | emoticons charmap insertdatetime pagebreak | accordion searchreplace visualblocks code fullscreen preview | help',
              ],
              quickbars_selection_toolbar:
                'bold italic underline | quicklink h2 h3 blockquote quickimage quicktable',
              toolbar_mode: 'sliding',
              contextmenu: 'link image table',
              skin: isDark ? 'oxide-dark' : 'oxide',
              content_css: isDark ? 'dark' : 'default',
              branding: false,
              promotion: false,
              elementpath: true,
              resize: true,
              font_size_formats: '10px 12px 13px 14px 15px 16px 18px 20px 24px 32px 36px',
              placeholder: 'Type or paste your content here...',
              content_style: `
                body {
                  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                  font-size: 14px;
                  line-height: 1.5;
                  padding: 0.875rem 1rem;
                  color: ${isDark ? '#f1f5f9' : '#0f172a'};
                  background-color: ${isDark ? '#161f30' : '#ffffff'};
                }
                p { margin-bottom: 0.65rem; }
                h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
                h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
                h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.35rem; }
                table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 13px; }
                th, td { padding: 6px 10px; border: 1px solid ${isDark ? '#334155' : '#e2e8f0'}; }
                th { background-color: ${isDark ? '#1e293b' : '#f8fafc'}; font-weight: 600; }
                code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12.5px; padding: 2px 4px; border-radius: 4px; background: ${isDark ? '#1e293b' : '#f1f5f9'}; }
                img { max-width: 100%; height: auto; border-radius: 6px; }
              `,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[580px] text-gray-400">
            <Sparkles className="w-6 h-6 animate-pulse mb-2 text-blue-500" />
            <p className="text-sm font-medium">Loading offline TinyMCE editor...</p>
          </div>
        )}

        {/* Live Bottom Stats Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>
              Words: <strong className="text-gray-700 dark:text-gray-200">{stats.words}</strong>
            </span>
            <span>
              Characters: <strong className="text-gray-700 dark:text-gray-200">{stats.chars}</strong>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              <span>~{stats.readingTime} min read</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Offline Mode Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

