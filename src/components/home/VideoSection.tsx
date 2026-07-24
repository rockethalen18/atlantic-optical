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
    color: 'var(--blue)',
  },
  {
    Icon: Icons.ShieldCheck,
    title: 'Control de Calidad Riguroso',
    desc: 'Inspección antes del envío. Cada equipo pasa por nuestro equipo de calidad con protocolo de 47 puntos.',
    color: 'var(--green)',
  },
  {
    Icon: Icons.Truck,
    title: 'Envío Puerta a Puerta Latinoamérica',
    desc: 'Coordinación completa del envío desde la fábrica en China hasta tu consultorio en Latinoamérica.',
    color: 'var(--blue)',
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

    gsap.set(items, { opacity: 0, x: -40 });
    gsap.to(items, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    });

    if (right) {
      gsap.set(right, { opacity: 0, x: 40, scale: 0.97 });
      gsap.to(right, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.2,
      });
    }
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 md:py-36 bg-white">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[var(--blue)]" />
              <span className="text-[11px] font-semibold text-[var(--blue)] uppercase tracking-[0.18em]">Nuestros Socios</span>
            </div>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em] mb-12" style={{ fontFamily: 'var(--font-display)' }}>
              Las Mejores Fábricas del Mundo
            </h2>

            <div className="space-y-8">
              {features.map((f, i) => (
                <div key={i} className="vid-item group flex gap-5">
                  <div className="w-14 h-14 bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--blue)]/5 group-hover:border-[var(--blue)]/20 transition-all duration-300">
                    <span style={{ color: f.color }}><f.Icon size={22} /></span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[var(--text)] mb-1.5 group-hover:text-[var(--blue)] transition-colors">{f.title}</h4>
                    <p className="text-[13px] text-[var(--text-muted)] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link href="/nosotros" className="inline-flex items-center gap-2 bg-[var(--blue)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3.5 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(37,99,235,0.25)]">
                Conocer Más <Icons.ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="vid-right">
            <div className="bg-[var(--bg-alt)] border border-[var(--border)] p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[var(--blue)] opacity-[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-12 h-12 bg-[var(--blue)] flex items-center justify-center shrink-0">
                  <Icons.Eye size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.14em]">Atlantic Optical</div>
                  <div className="text-[14px] sm:text-[15px] font-bold text-[var(--text)]">Proveedor desde 2011</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-10">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[24px] sm:text-[32px] md:text-[38px] font-black text-[var(--blue)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.1em] sm:tracking-[0.14em] mt-2 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[12px]">
                  <Icons.ShieldCheck size={15} className="text-[var(--blue)] shrink-0" />
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
