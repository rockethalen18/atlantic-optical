'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const reviews = [
  {
    name: 'Dr. Carlos Méndez',
    role: 'Oftalmólogo',
    location: 'Ciudad de México',
    text: 'Excelente calidad en todos los equipos. El soporte post-venta es excepcional. Ya realizamos 3 compras con Atlantic Optical y cada una superó expectativas.',
    rating: 5,
    initial: 'CM',
    color: 'var(--green)',
  },
  {
    name: 'Dra. María García',
    role: 'Optometrista',
    location: 'Guadalajara, Jalisco',
    text: 'El auto-refractometro ARK-7710 superó nuestras expectativas. Precisión clínica y diseño profesional. El envío fue rápido y bien coordinado.',
    rating: 5,
    initial: 'MG',
    color: 'var(--blue)',
  },
  {
    name: 'Ing. Roberto Sánchez',
    role: 'Director de Laboratorio',
    location: 'Monterrey, N.L.',
    text: 'Los costos variables de envío son muy transparentes y justos. El equipo llegó en perfecto estado. Totalmente recomendados como proveedor.',
    rating: 5,
    initial: 'RS',
    color: 'var(--green-dark)',
  },
];

const stats = [
  { value: '500+', label: 'Equipos Entregados' },
  { value: '98%', label: 'Clientes Satisfechos' },
  { value: '12', label: 'Años de Experiencia' },
  { value: '24/7', label: 'Soporte Técnico' },
];

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll<HTMLElement>('.review-card');
    const statEls = sectionRef.current.querySelectorAll<HTMLElement>('.stat-item');

    gsap.set(cards, { opacity: 0, y: 40, rotateX: 6 });
    gsap.to(cards, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.7, stagger: 0.12, ease: 'power3.out',
    });

    gsap.set(statEls, { opacity: 0, y: 20 });
    gsap.to(statEls, {
      scrollTrigger: { trigger: '.stats-row', start: 'top 85%', once: true },
      opacity: 1, y: 0,
      duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.3,
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-28 bg-[var(--bg)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Testimonios</span>
          <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="w-12 h-[2px] bg-[var(--green)] mx-auto mt-4" />
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16" style={{ perspective: '1200px' }}>
          {reviews.map((r, i) => (
            <div key={i} className="review-card group relative bg-white border border-[var(--border)] p-7 hover:border-[var(--green)]/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,101,53,0.06)]">
              {/* Quote mark */}
              <div className="absolute top-5 right-6 text-[60px] font-black text-[var(--green)] opacity-[0.06] leading-none" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, si) => (
                  <Icons.Star key={si} size={13} className="text-[var(--star)] fill-[var(--star)]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7] mb-6 relative z-10">&ldquo;{r.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-[var(--border-light)]">
                <div
                  className="w-10 h-10 text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.initial}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[var(--text)]">{r.name}</div>
                  <div className="text-[11px] text-[var(--text-soft)]">{r.role} — {r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats-row grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--bg-alt)] p-6 sm:p-8 border border-[var(--border)]">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center">
              <div className="text-[24px] sm:text-[28px] md:text-[34px] font-black text-[var(--green)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.1em] sm:tracking-[0.14em] mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
