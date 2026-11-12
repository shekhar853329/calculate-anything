import { useState } from 'react';
import { Copy, Check, Twitter, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title?: string;
}

export default function ShareButtons({ title = 'Check out this tool!' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function getUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  async function handleCopy() {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleTwitter() {
    const url = getUrl();
    const text = encodeURIComponent(`${title} ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  function handleWhatsApp() {
    const url = getUrl();
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="flex items-center gap-2 flex-wrap" aria-label="Share this tool">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Share:</span>

      <button
        onClick={handleCopy}
        aria-label={copied ? 'URL copied!' : 'Copy URL'}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            Copy Link
          </>
        )}
      </button>

      <button
        onClick={handleTwitter}
        aria-label="Share on X (Twitter)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-sky-400 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
      >
        <Twitter className="w-3.5 h-3.5" aria-hidden="true" />
        Twitter/X
      </button>

      <button
        onClick={handleWhatsApp}
        aria-label="Share on WhatsApp"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-400 dark:hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        WhatsApp
      </button>
    </div>
  );
}
