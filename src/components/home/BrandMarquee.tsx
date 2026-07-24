'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

const brands = [
  'Topcon', 'Nidek', 'Canon', 'Huvitz', ' Tomey', 'Rexxam',
  'Grand Seiko', 'Marco', 'Essilor', 'Zeiss', 'Haag-Streit',
  'Reichert', 'Keeler', 'Hill-Rom', 'Inami', 'Takumi',
];

export default function BrandMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 40,
      ease: 'none',
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-[var(--bg-alt)] border-y border-[var(--border-light)] overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10 mb-10">
        <div className="text-center">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Marcas que Llevamos</span>
          <h2 className="text-[28px] md:text-[36px] font-black text-[var(--text)] tracking-[-0.03em]" style={{ fontFamily: 'var(--font-display)' }}>
            Las Mejores del Mundo
          </h2>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-alt)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-alt)] to-transparent z-10" />

        <div ref={trackRef} className="flex gap-8 items-center whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center gap-3 px-8 py-4 bg-white border border-[var(--border)] hover:border-[var(--blue)]/20 hover:shadow-[0_8px_30px_rgba(14,165,233,0.08)] transition-all duration-300 flex-shrink-0">
              <div className="w-10 h-10 bg-[var(--bg-alt)] flex items-center justify-center flex-shrink-0">
                <span className="text-[18px] font-black text-[var(--text-soft)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {brand.charAt(0)}
                </span>
              </div>
              <span className="text-[14px] font-bold text-[var(--text-muted)] tracking-[-0.01em]">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
