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
    <section ref={sectionRef} className="py-16 md:py-28 bg-gradient-to-br from-[var(--green-dark)] via-[var(--green)] to-[var(--blue)] relative overflow-hidden animate-gradient">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Floating orbs */}
      <div className="absolute w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[80px] -top-20 -left-20" />
      <div className="absolute w-[250px] h-[250px] bg-white opacity-10 rounded-full blur-[60px] -bottom-16 -right-16" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10 text-center">
        <div className="cta-item mb-4">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Contáctanos</span>
        </div>
        <div className="cta-item mb-5">
          <h2 className="text-[32px] md:text-[48px] font-black text-white tracking-[-0.04em] leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
            ¿Listo para modernizar<br className="hidden md:block" /> tu consultorio?
          </h2>
        </div>
        <div className="cta-item mb-10">
          <p className="text-[15px] text-white/60 max-w-[460px] mx-auto leading-[1.7]">
            Cotización personalizada en menos de 24 horas. Envío directo a México con costos transparentes.
          </p>
        </div>
        <div className="cta-item flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contacto" className="group inline-flex items-center justify-center gap-3 bg-white text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-white/90 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
            Solicitar Cotización
            <Icons.ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/productos" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/25 font-bold text-[12px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-white/20 backdrop-blur transition-all">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
