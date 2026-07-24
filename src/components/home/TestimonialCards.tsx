'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const testimonials = [
  { name: 'Dr. Carlos Mendoza', role: 'Director Clínica Visual', country: 'México', text: 'Llevamos 3 años trabajando con Atlantic Optical. La calidad de los equipos y el soporte post-venta es excepcional. Nuestros pacientes notan la diferencia.', rating: 5 },
  { name: 'Dra. María Elena Ríos', role: 'Óptica San Pablo', country: 'Colombia', text: 'El envío fue rápido y el equipo llegó perfectamente empacado. La biseladora automática transformó nuestro laboratorio. 100% recomendados.', rating: 5 },
  { name: 'Ing. Roberto Silva', role: 'Distribuidor Mayorista', country: 'Chile', text: 'Como distribuidor, el margen y el soporte comercial son inmejorables. Atlantic Optical entiende las necesidades del mercado latinoamericano.', rating: 5 },
  { name: 'Dr. Fernando Torres', role: 'Centro Oftalmológico Visual', country: 'Perú', text: 'El auto refractómetro Huvitz que nos vendieron es de primera calidad. La cotización fue rápida y el precio muy competitivo vs competencia.', rating: 5 },
];

export default function TestimonialCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>('.test-card');

    gsap.fromTo(cards,
      { opacity: 0, y: 40, rotateY: 15 },
      {
        opacity: 1, y: 0, rotateY: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [mounted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 md:py-36 glass-section">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Testimonios</span>
          <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            Lo que Dicen Nuestros Clientes
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1200px' }}>
          {testimonials.map((t, i) => (
            <div key={i}
              className={`test-card group relative p-8 md:p-10 glass-card transition-all duration-500 ${i === active ? 'border-[var(--blue)]/30 shadow-[0_20px_60px_rgba(14,165,233,0.1)]' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setActive(i)}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-[60px] font-black text-[var(--blue)] opacity-[0.06] leading-none" style={{ fontFamily: 'var(--font-display)' }}>&ldquo;</div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Icons.Star key={j} size={14} className="text-[var(--star)] fill-[var(--star)]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[15px] text-[var(--text)] leading-[1.75] mb-8 relative z-10">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--blue-light)] flex items-center justify-center flex-shrink-0">
                  <span className="text-[16px] font-black text-[var(--blue)]" style={{ fontFamily: 'var(--font-display)' }}>{t.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[var(--text)]">{t.name}</div>
                  <div className="text-[12px] text-[var(--text-muted)]">{t.role} · {t.country}</div>
                </div>
              </div>

              {/* Hover border glow */}
              <div className={`absolute inset-0 border border-[var(--blue)] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
