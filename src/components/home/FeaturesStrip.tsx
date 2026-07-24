'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const features = [
  { icon: Icons.Truck, title: 'Envío Directo', desc: 'China → Latinoamérica', stat: '30-45 días' },
  { icon: Icons.ShieldCheck, title: 'Garantía 12 Meses', desc: 'Soporte incluido', stat: '100%' },
  { icon: Icons.Tag, title: 'Mejor Precio', desc: 'Directo de fábrica', stat: '-40%' },
  { icon: Icons.Headphones, title: 'Soporte 24/7', desc: 'Asesoría técnica', stat: '24/7' },
];

export default function FeaturesStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>('.feat-card');
    gsap.set(els, { opacity: 0, y: 30 });
    gsap.to(els, {
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
    });
  }, []);

  return (
    <section className="bg-white border-b border-[var(--border-light)]">
      <div ref={ref} className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className={`feat-card group flex items-center gap-5 py-7 px-6 md:px-8 border-[var(--border-light)] ${i < 3 ? 'border-r' : ''} transition-colors hover:bg-[var(--bg-alt)]`}>
              <div className="w-12 h-12 bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 group-hover:border-[var(--blue)]/30 transition-colors">
                <f.icon size={20} className="text-[var(--blue)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[var(--text)] mb-0.5">{f.title}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{f.desc}</div>
              </div>
              <div className="text-[18px] font-black text-[var(--blue)] hidden sm:block" style={{ fontFamily: 'var(--font-display)' }}>{f.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
