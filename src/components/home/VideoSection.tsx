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
    color: '#006535',
    bg: 'rgba(0,101,53,0.08)',
  },
  {
    Icon: Icons.ShieldCheck,
    title: 'Control de Calidad Riguroso',
    desc: 'Inspección antes del envío. Cada equipo pasa por nuestro equipo de calidad con protocolo de 47 puntos.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    Icon: Icons.Truck,
    title: 'Envío Puerta a Puerta México',
    desc: 'Coordinación completa del envío desde la fábrica en China hasta tu consultorio en México.',
    color: '#0f3460',
    bg: 'rgba(15,52,96,0.08)',
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
    <section ref={sectionRef} className="py-16 md:py-28 bg-[var(--bg-alt)] relative overflow-hidden beam-left beam-right">
      {/* Decorative */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[var(--green)] opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: features */}
          <div>
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Nuestros Socios</span>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em] mt-1 mb-10" style={{ fontFamily: 'var(--font-display)' }}>
              Las Mejores Fábricas del Mundo
            </h2>

            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="vid-item group flex gap-5">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: f.bg }}
                  >
                    <span style={{ color: f.color }}><f.Icon size={20} /></span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[var(--text)] mb-1.5 group-hover:text-[var(--green)] transition-colors">{f.title}</h4>
                    <p className="text-[13px] text-[var(--text-muted)] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/nosotros" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3.5 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)]">
                Conocer Más <Icons.ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right: visual card */}
          <div className="vid-right relative">
            {/* Gradient card with stats */}
            <div className="relative bg-gradient-to-br from-[var(--green-dark)] via-[var(--green)] to-[#00a86b] p-10 md:p-12 overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.08]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />

              {/* Floating orbs */}
              <div className="absolute w-[200px] h-[200px] bg-white opacity-10 rounded-full blur-[60px] -top-10 -right-10" />
              <div className="absolute w-[150px] h-[150px] bg-white opacity-10 rounded-full blur-[50px] -bottom-8 -left-8" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Icons.Eye size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white/70 uppercase tracking-[0.16em]">Atlantic Optical</div>
                    <div className="text-[14px] font-bold text-white">Proveedor desde 2011</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {stats.map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-[32px] md:text-[40px] font-black text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                      <div className="text-[9px] font-semibold text-white/60 uppercase tracking-[0.14em] mt-2">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2 text-white/70 text-[12px]">
                    <Icons.ShieldCheck size={14} className="text-white" />
                    <span>Certificaciones ISO 13485 · CE · FDA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
