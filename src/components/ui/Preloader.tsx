'use client';

import { useEffect, useState } from 'react';
import Icons from '@/components/ui/Icons';

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--text)] flex flex-col items-center justify-center transition-opacity duration-700" style={{ opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[var(--green)] flex items-center justify-center rounded-lg animate-pulse">
          <Icons.Eye size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-extrabold text-white tracking-[0.02em] leading-none">ATLANTIC</span>
          <span className="text-[8px] font-semibold tracking-[0.35em] text-[var(--green-status)] uppercase leading-none mt-[2px]">OPTICAL</span>
        </div>
      </div>
      <div className="w-32 h-[2px] bg-white/10 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-[var(--green)] animate-[preloader_1.8s_ease-in-out]" />
      </div>
    </div>
  );
}
