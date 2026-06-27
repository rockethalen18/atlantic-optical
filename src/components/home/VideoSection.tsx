'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const features = [
  {
    Icon: Icons.Factory,
    title: 'Fábricas Certificadas ISO',
    desc: 'Todos nuestros proveedores cuentan con certificaciones ISO 13485 y CE para equipos médicos de alta precisión.',
    color: 'var(--green)',
  },
  {
    Icon: Icons.ShieldCheck,
    title: 'Control de Calidad Riguroso',
    desc: 'Inspección antes del envío. Cada equipo pasa por nuestro equipo de calidad con protocolo de 47 puntos.',
    color: 'var(--blue)',
  },
  {
    Icon: Icons.Truck,
    title: 'Envío Puerta a Puerta México',
    desc: 'Coordinación completa del envío desde la fábrica en China hasta tu consultorio en México.',
    color: 'var(--green-dark)',
  },
];

const stats = [
  { value: '50+', label: 'Fábricas Aliadas' },
  { value: '200+', label: 'Modelos Disponibles' },
  { value: '15+', label: 'Años de Experiencia' },
];

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll<HTMLElement>('.vid-item');
    const right = sectionRef.current.querySelector<HTMLElement>('.vid-right');

    gsap.set(items, { opacity: 0, x: -30 });
    gsap.to(items, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, x: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    });

    if (right) {
      gsap.set(right, { opacity: 0, x: 40 });
      gsap.to(right, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2,
      });
    }
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 md:py-32 bg-white">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: features */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[var(--blue)]" />
              <span className="text-[11px] font-semibold text-[var(--blue)] uppercase tracking-[0.18em]">Nuestros Socios</span>
            </div>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em] mb-12" style={{ fontFamily: 'var(--font-display)' }}>
              Las Mejores Fábricas del Mundo
            </h2>

            <div className="space-y-8">
              {features.map((f, i) => (
                <div key={i} className="vid-item group flex gap-5">
                  <div className="w-12 h-12 bg-[var(--bg-alt)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--green-light)] transition-colors duration-300">
                    <span style={{ color: f.color }}><f.Icon size={20} /></span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[var(--text)] mb-1.5 group-hover:text-[var(--green)] transition-colors">{f.title}</h4>
                    <p className="text-[13px] text-[var(--text-muted)] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link href="/nosotros" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(30,58,95,0.25)]">
                Conocer Más <Icons.ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right: stats card */}
          <div className="vid-right">
            <div className="bg-[var(--bg-alt)] border border-[var(--border)] p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 bg-[var(--green)] flex items-center justify-center shrink-0">
                  <Icons.Eye size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.14em]">Atlantic Optical</div>
                  <div className="text-[13px] sm:text-[14px] font-bold text-[var(--text)]">Proveedor desde 2011</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 md:mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[22px] sm:text-[32px] md:text-[38px] font-black text-[var(--green)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.1em] sm:tracking-[0.14em] mt-1.5 sm:mt-2 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-5 sm:pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[11px] sm:text-[12px]">
                  <Icons.ShieldCheck size={14} className="text-[var(--green)] shrink-0" />
                  <span className="leading-tight">Certificaciones ISO 13485 · CE · FDA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
