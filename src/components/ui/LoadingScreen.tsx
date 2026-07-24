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
    }, 3000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0a1628] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Pulse ring effect */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--blue)]/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-[var(--blue)]/20 animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-[var(--blue)]/10 animate-ping" style={{ animationDelay: '1s' }} />

        {/* Logo */}
        <div className="relative z-10 animate-pulse">
          <img
            src="/images/logo-dark.png"
            alt="Atlantic Optical"
            className="w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          />
        </div>
      </div>

      {/* Loading bar */}
      <div className="mt-10 w-48 h-[2px] bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[var(--blue)] to-[var(--blue-hover)] animate-loading-bar" />
      </div>

      {/* Text */}
      <p className="mt-6 text-[12px] text-white/40 uppercase tracking-[0.3em] font-medium">
        Cargando
      </p>
    </div>
  );
}
