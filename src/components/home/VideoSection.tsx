'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.vid-item');
    if (!els.length) return;
    gsap.set(els, { opacity: 0, x: -30 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--bg)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="wow-slideLeft">
            <span className="text-[10px] font-semibold text-[var(--green)] uppercase tracking-[0.18em]">Nuestros Socios</span>
            <h2 className="text-[28px] md:text-[38px] font-black text-[var(--text)] tracking-[-0.04em] mt-1 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Las Mejores Fábricas del Mundo
            </h2>

            <div className="space-y-5">
              <div className="vid-item flex gap-4">
                <div className="w-10 h-10 bg-[var(--green)]/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Icons.Factory size={18} className="text-[var(--green)]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[var(--text)] mb-1">Fábricas Certificadas</h4>
                  <p className="text-[13px] text-[var(--text-muted)] leading-[1.6]">Todos nuestros proveedores cuentan con certificaciones ISO 13485 y CE para equipos médicos.</p>
                </div>
              </div>
              <div className="vid-item flex gap-4">
                <div className="w-10 h-10 bg-[var(--amber)]/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Icons.ShieldCheck size={18} className="text-[var(--amber)]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[var(--text)] mb-1">Control de Calidad</h4>
                  <p className="text-[13px] text-[var(--text-muted)] leading-[1.6]">Inspección rigurosa antes del envío. Cada equipo pasa por nuestro equipo de calidad.</p>
                </div>
              </div>
              <div className="vid-item flex gap-4">
                <div className="w-10 h-10 bg-[var(--green)]/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Icons.Truck size={18} className="text-[var(--green)]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[var(--text)] mb-1">Envío Puerta a Puerta</h4>
                  <p className="text-[13px] text-[var(--text-muted)] leading-[1.6]">Coordinación completa del envío desde la fábrica hasta tu consultorio en México.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="wow-slideRight relative aspect-[16/10] bg-[var(--bg-alt)] overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800&q=80" alt="Fábrica de equipos ópticos" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-[24px] font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>50+</div>
                    <div className="text-[10px] text-white/60 font-semibold uppercase tracking-[0.12em]">Fábricas</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-[24px] font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>200+</div>
                    <div className="text-[10px] text-white/60 font-semibold uppercase tracking-[0.12em]">Modelos</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-[24px] font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>15+</div>
                    <div className="text-[10px] text-white/60 font-semibold uppercase tracking-[0.12em]">Años</div>
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
