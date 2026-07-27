'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/images/logos/logo-dark.png';

    const handleReady = () => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 400);
    };

    if (document.readyState === 'complete') {
      handleReady();
    } else {
      window.addEventListener('load', handleReady);
    }

    const timer = setTimeout(handleReady, 2000);

    return () => {
      window.removeEventListener('load', handleReady);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-400 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)' }}
    >
      <style>{`
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.85; }
        }
      `}</style>
      <img
        src="/images/logos/logo-dark.png"
        alt="Atlantic Optical International Limited"
        width={400}
        height={400}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="w-[240px] md:w-[300px] h-auto object-contain"
        style={{ animation: 'logo-pulse 2s ease-in-out infinite' }}
      />
    </div>
  );
}
