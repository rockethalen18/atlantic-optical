'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500);
    }, 2500);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)' }}
    >
      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--blue)]/10 animate-ping" />
        <div className="absolute inset-4 rounded-full border border-[var(--blue)]/15 animate-ping" style={{ animationDelay: '0.3s' }} />
        <div className="absolute inset-8 rounded-full border border-[var(--blue)]/10 animate-ping" style={{ animationDelay: '0.6s' }} />
        <img
          src="/favicon.png"
          alt="Atlantic Optical"
          width={160}
          height={160}
          loading="eager"
          fetchPriority="high"
          className="relative z-10 w-[140px] h-[140px] object-contain animate-[pulse-glow_2s_ease-in-out_infinite]"
        />
      </div>
      <div className="mt-2 w-48 h-[2px] bg-[var(--blue)]/10 overflow-hidden rounded-full">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--blue)]/40 to-transparent animate-loading-bar" />
      </div>
    </div>
  );
}
