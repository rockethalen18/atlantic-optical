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
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 25 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--green)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10 text-center">
        <div className="cta-item mb-4">
          <span className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.18em]">Contáctanos</span>
        </div>
        <div className="cta-item mb-4">
          <h2 className="text-[28px] md:text-[42px] font-black text-white tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            ¿Listo para modernizar tu consultorio?
          </h2>
        </div>
        <div className="cta-item mb-8">
          <p className="text-[15px] text-white/70 max-w-[500px] mx-auto leading-[1.65]">
            Cotización personalizada en menos de 24 horas. Envío directo a México con costos transparentes.
          </p>
        </div>
        <div className="cta-item flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contacto" className="inline-flex items-center justify-center gap-2 bg-white text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3.5 hover:bg-white/90 transition-colors">
            Solicitar Cotización <Icons.ArrowRight size={13} />
          </Link>
          <Link href="/productos" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3.5 hover:bg-white/20 backdrop-blur transition-colors">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
