'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const features = [
  { Icon: Icons.Factory, title: 'Fábricas Certificadas ISO', desc: 'Todos nuestros proveedores cuentan con certificaciones ISO 13485 y CE.' },
  { Icon: Icons.ShieldCheck, title: 'Control de Calidad Riguroso', desc: 'Protocolo de 47 puntos de inspección antes del envío.' },
  { Icon: Icons.Truck, title: 'Envío Puerta a Puerta', desc: 'Coordinación completa desde China hasta tu consultorio.' },
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
      gsap.set(right, { opacity: 0, scale: 0.95 });
      gsap.to(right, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.3,
      });
    }
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-36 glass-section">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Nuestros Socios</span>
            <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em] mb-14 leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              Las Mejores Fábricas del Mundo
            </h2>
            <div className="space-y-10">
              {features.map((f, i) => (
                <div key={i} className="vid-item group flex gap-6">
                  <div className="w-14 h-14 glass-card flex items-center justify-center flex-shrink-0 group-hover:border-[var(--blue)]/20 transition-all duration-300">
                    <f.Icon size={22} className="text-[var(--blue)]" />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-[var(--text)] mb-1.5 group-hover:text-[var(--blue)] transition-colors">{f.title}</h4>
                    <p className="text-[14px] text-[var(--text-muted)] leading-[1.7]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-14">
              <Link href="/nosotros" className="inline-flex items-center gap-3 bg-[var(--dark-bg)] text-white font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-[var(--dark-surface)] transition-all duration-300">
                Conocer Más <Icons.ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="vid-right">
            <div className="glass-card p-8 md:p-12 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-[var(--blue)] flex items-center justify-center shrink-0">
                  <Icons.Eye size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.14em]">Atlantic Optical</div>
                  <div className="text-[16px] font-bold text-[var(--text)]">Proveedor desde 2011</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center py-6 bg-[var(--bg-alt)]">
                    <div className="text-[28px] md:text-[36px] font-black text-[var(--blue)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                    <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.12em] mt-2 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-[var(--border)] flex items-center gap-2 text-[var(--text-muted)] text-[13px]">
                <Icons.ShieldCheck size={16} className="text-[var(--blue)] shrink-0" />
                <span>Certificaciones ISO 13485 · CE · FDA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
