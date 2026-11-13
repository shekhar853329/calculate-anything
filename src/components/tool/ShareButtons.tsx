import { useState } from 'react';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title?: string;
}

function XIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
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
      <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" /> Share:
      </span>

      <button
        onClick={handleCopy}
        aria-label={copied ? 'URL copied!' : 'Copy URL'}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        onClick={handleTwitter}
        aria-label="Share on X (Twitter)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-sky-400 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors shadow-sm"
      >
        <XIcon className="w-3 h-3" />
        <span>Post</span>
      </button>

      <button
        onClick={handleWhatsApp}
        aria-label="Share on WhatsApp"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm"
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
        <span>WhatsApp</span>
      </button>
    </div>
  );
}
