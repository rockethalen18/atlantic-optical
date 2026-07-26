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
      style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)' }}
    >
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border border-white/5 animate-ping" />
        <div className="absolute inset-3 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '0.4s' }} />
        <img
          src="/images/logos/logo-dark.png"
          alt="Atlantic Optical"
          width={200}
          height={112}
          loading="eager"
          fetchPriority="high"
          className="relative z-10 w-[200px] h-auto object-contain"
        />
      </div>
      <div className="mt-4 w-40 h-[1px] bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-loading-bar" />
      </div>
    </div>
  );
}
