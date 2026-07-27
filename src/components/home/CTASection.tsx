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
    <section ref={sectionRef} className="py-16 md:py-40 relative overflow-hidden glass-section">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[var(--blue)] opacity-[0.03] rounded-full blur-[200px] -translate-y-1/3 translate-x-1/4" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10 text-center">
        <div className="cta-item mb-5">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Contáctanos</span>
        </div>
        <div className="cta-item mb-8">
          <h2 className="text-[36px] md:text-[52px] font-black text-[var(--text)] tracking-[-0.04em] leading-[1.06]" style={{ fontFamily: 'var(--font-display)' }}>
            ¿Listo para modernizar<br className="hidden md:block" /> tu consultorio?
          </h2>
        </div>
        <div className="cta-item mb-12">
          <p className="text-[16px] text-[var(--text-muted)] max-w-[500px] mx-auto leading-[1.7]">
            Cotización personalizada en menos de 24 horas. Envío directo a toda Latinoamérica.
          </p>
        </div>
        <div className="cta-item flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contacto" className="group inline-flex items-center justify-center gap-3 bg-[var(--blue)] text-white font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4.5 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.25)]">
            Solicitar Cotización <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/productos" className="inline-flex items-center justify-center gap-2 bg-white text-[var(--text)] border border-[var(--border)] font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4.5 hover:bg-[var(--bg-alt)] transition-all duration-300">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
