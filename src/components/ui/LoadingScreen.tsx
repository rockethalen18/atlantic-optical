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
      style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)' }}
    >
      <div className="relative flex flex-col items-center justify-center">
        <img
          src="/images/logos/logo-dark.png"
          alt="Atlantic Optical International Limited"
          width={400}
          height={400}
          loading="eager"
          fetchPriority="high"
          className="w-[260px] md:w-[340px] h-auto object-contain animate-[pulse-glow_2.5s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );
}
