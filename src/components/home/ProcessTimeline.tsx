'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const steps = [
  { num: '01', icon: Icons.Search, title: 'Elige tu Equipo', desc: 'Explora nuestro catálogo de +200 productos de las mejores fábricas del mundo.' },
  { num: '02', icon: Icons.FileText, title: 'Cotización Personalizada', desc: 'Recibe precios competitivos, opciones de envío y tiempos de entrega en 24h.' },
  { num: '03', icon: Icons.CreditCard, title: 'Compra Segura', desc: 'Pago por transferencia bancaria, PayPal o Western Union. Facturación internacional.' },
  { num: '04', icon: Icons.Truck, title: 'Envío Puerta a Puerta', desc: 'Coordinación completa desde China a tu país. Seguimiento en tiempo real.' },
  { num: '05', icon: Icons.ShieldCheck, title: 'Garantía y Soporte', desc: '18 meses de garantía. Soporte técnico 24/7 por WhatsApp y email.' },
];

export default function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !timelineRef.current) return;
    const items = ref.current.querySelectorAll<HTMLElement>('.step-item');
    const line = timelineRef.current;

    // Line draw animation
    gsap.fromTo(line,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Stagger items
    gsap.fromTo(items,
      { opacity: 0, x: -40, scale: 0.9 },
      {
        opacity: 1, x: 0, scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section className="py-24 md:py-36 bg-white">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="text-center mb-20">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Proceso Simple</span>
          <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            De la Selección a tu Consultorio
          </h2>
        </div>

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-[var(--border)]">
            <div ref={timelineRef} className="h-full bg-gradient-to-r from-[var(--blue)] to-[var(--blue-hover)] origin-left" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="step-item group text-center lg:text-center">
                <div className="relative mb-6 inline-flex">
                  <div className="w-[72px] h-[72px] bg-white border-2 border-[var(--border)] flex items-center justify-center group-hover:border-[var(--blue)] group-hover:bg-[var(--blue-light)] transition-all duration-500 relative z-10">
                    <step.icon size={28} className="text-[var(--text-soft)] group-hover:text-[var(--blue)] transition-colors" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-[28px] h-[28px] bg-[var(--blue)] text-white text-[10px] font-black flex items-center justify-center" style={{ fontFamily: 'var(--font-display)' }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-[var(--text)] mb-2 group-hover:text-[var(--blue)] transition-colors">{step.title}</h3>
                <p className="text-[13px] text-[var(--text-muted)] leading-[1.6] max-w-[220px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/productos" className="inline-flex items-center gap-3 bg-[var(--blue)] text-white font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)]">
            Empezar Ahora <Icons.ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
