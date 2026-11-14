import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, X, ArrowRight } from 'lucide-react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('ca_launch_announcement_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch (_) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('ca_launch_announcement_dismissed', 'true');
    } catch (_) {}
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Site announcement"
      className="relative z-50 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 text-white text-xs sm:text-sm shadow-sm transition-all border-b border-blue-500/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0 flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white tracking-wide shrink-0">
            <Sparkles className="w-3 h-3 text-amber-300" aria-hidden="true" />
            <span>Just Launched</span>
          </span>
          <p className="font-medium text-white/95 text-center sm:text-left leading-tight sm:leading-normal">
            <span>CalculateAnything launched on 13 Nov 2026! We will keep adding more tools continuously.</span>
            <span className="hidden md:inline text-blue-100"> Have any suggestions?</span>
          </p>
          <a
            href="/contact/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs transition-colors shrink-0 shadow-sm group"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span>Drop a comment</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </a>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1"
          aria-label="Dismiss announcement"
          title="Dismiss announcement"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
