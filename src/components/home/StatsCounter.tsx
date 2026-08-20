'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';

const stats = [
  { value: 15, suffix: '+', label: 'Años de Experiencia', prefix: '' },
  { value: 2000, suffix: '+', label: 'Equipos Instalados', prefix: '' },
  { value: 35, suffix: '', label: 'Países Atendidos', prefix: '' },
  { value: 98, suffix: '%', label: 'Clientes Satisfechos', prefix: '' },
  { value: 50, suffix: '+', label: 'Fábricas Aliadas', prefix: '' },
  { value: 24, suffix: '/7', label: 'Soporte Técnico', prefix: '' },
];

function AnimatedNumber({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
      },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, [mounted, target, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('.stat-item');

    gsap.fromTo(items,
      { opacity: 0, y: 50, scale: 0.8 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [mounted]);

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-white opacity-5 rounded-full blur-[100px]" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-white/40" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Números que Hablan</span>
            <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-white/40" />
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            Resultados que Inspiran Confianza
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center p-6 md:p-8 glass-stat">
              <div className="text-[32px] md:text-[40px] font-black text-white leading-none mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {mounted ? <AnimatedNumber target={s.value} suffix={s.suffix} prefix={s.prefix} /> : `${s.prefix}0${s.suffix}`}
              </div>
              <div className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.1em]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
