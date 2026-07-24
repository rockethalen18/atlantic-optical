'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const features = [
  { icon: Icons.Truck, title: 'Envío Directo', desc: 'China → Latinoamérica', accent: 'var(--blue)' },
  { icon: Icons.ShieldCheck, title: 'Garantía 12 Meses', desc: 'Soporte incluido', accent: 'var(--green)' },
  { icon: Icons.Tag, title: 'Mejor Precio', desc: 'Directo de fábrica', accent: 'var(--blue)' },
  { icon: Icons.Headphones, title: 'Soporte 24/7', desc: 'Asesoría técnica', accent: 'var(--green)' },
];

export default function FeaturesStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>('.feat-card');
    gsap.set(els, { opacity: 0, y: 30, scale: 0.95 });
    gsap.to(els, {
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      opacity: 1, y: 0, scale: 1,
      duration: 0.6, stagger: 0.1, ease: 'power3.out',
    });
  }, []);

  return (
    <section className="bg-white border-b border-[var(--border-light)]">
      <div ref={ref} className="max-w-[1680px] mx-auto px-6 md:px-10 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="feat-card group relative bg-[var(--bg-alt)] border border-[var(--border)] p-5 md:p-6 hover:border-[var(--blue)]/20 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] hover:-translate-y-0.5"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--blue)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mb-4 group-hover:border-[var(--blue)]/20 transition-all duration-300">
                <f.icon size={22} className="text-[var(--blue)]" style={{ color: f.accent }} />
              </div>
              <div>
                <div className="text-[13px] md:text-[14px] font-bold text-[var(--text)] mb-1">{f.title}</div>
                <div className="text-[11px] md:text-[12px] text-[var(--text-muted)] leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
