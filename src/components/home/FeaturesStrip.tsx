'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const features = [
  { icon: Icons.Truck, title: 'Envío Directo', desc: 'China → México' },
  { icon: Icons.ShieldCheck, title: 'Garantía 12 Meses', desc: 'Soporte incluido' },
  { icon: Icons.Tag, title: 'Mejor Precio', desc: 'Directo de fábrica' },
  { icon: Icons.Headphones, title: 'Soporte 24/7', desc: 'Asesoría técnica' },
];

export default function FeaturesStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>('.feat-item');
    gsap.set(els, { opacity: 0, y: 15 });
    gsap.to(els, {
      scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.08, ease: 'power3.out',
    });
  }, []);

  return (
    <section className="bg-white border-y border-[var(--border-light)]">
      <div ref={ref} className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feat-item group flex items-center gap-4 py-6 px-5 transition-colors hover:bg-[var(--bg-alt)] ${
                i < 3 ? 'border-r border-[var(--border-light)]' : ''
              } ${i < 2 ? 'border-b md:border-b-0 border-[var(--border-light)]' : ''} ${i === 2 ? 'border-b md:border-b-0 border-[var(--border-light)]' : ''}`}
            >
              <div className="w-10 h-10 bg-[var(--bg-alt)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--green-light)] transition-colors duration-300">
                <f.icon size={18} className="text-[var(--green)]" />
              </div>
              <div>
                <div className="text-[12px] font-bold text-[var(--text)]">{f.title}</div>
                <div className="text-[11px] text-[var(--text-soft)]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
