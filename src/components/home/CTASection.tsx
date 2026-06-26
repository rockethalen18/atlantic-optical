'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.cta-item');
    gsap.set(els, { opacity: 0, y: 30 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[var(--green)] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--blue)] opacity-[0.1] rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white opacity-[0.03] rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10 text-center">
        <div className="cta-item mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-white/40" />
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.18em]">Contáctanos</span>
            <div className="w-8 h-[2px] bg-white/40" />
          </div>
        </div>
        <div className="cta-item mb-6">
          <h2 className="text-[32px] md:text-[48px] font-black text-white tracking-[-0.04em] leading-[1.08]" style={{ fontFamily: 'var(--font-display)' }}>
            ¿Listo para modernizar<br className="hidden md:block" /> tu consultorio?
          </h2>
        </div>
        <div className="cta-item mb-10">
          <p className="text-[16px] text-white/70 max-w-[480px] mx-auto leading-[1.7]">
            Cotización personalizada en menos de 24 horas. Envío directo a México con costos transparentes.
          </p>
        </div>
        <div className="cta-item flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contacto" className="group inline-flex items-center justify-center gap-3 bg-white text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-white/95 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            Solicitar Cotización
            <Icons.ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/productos" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/25 font-bold text-[12px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-white/20 transition-all duration-300">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
