'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const reviews = [
  { name: 'Dr. Carlos Méndez', role: 'Oftalmólogo', location: 'Ciudad de México', text: 'Excelente calidad en todos los equipos. El soporte post-venta es excepcional. Ya realizamos 3 compras y cada una superó expectativas.', rating: 5, initial: 'CM' },
  { name: 'Dra. María García', role: 'Optometrista', location: 'Guadalajara', text: 'El auto-refractómetro ARK-7710 superó nuestras expectativas. Precisión clínica y diseño profesional. El envío fue rápido.', rating: 5, initial: 'MG' },
  { name: 'Ing. Roberto Sánchez', role: 'Director de Laboratorio', location: 'Monterrey', text: 'Los costos de envío son transparentes y justos. El equipo llegó en perfecto estado. Totalmente recomendados.', rating: 5, initial: 'RS' },
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
    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.to(cards, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    });
    gsap.set(statEls, { opacity: 0, y: 20 });
    gsap.to(statEls, {
      scrollTrigger: { trigger: '.stats-row', start: 'top 85%', once: true },
      opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.3,
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 glass-section">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Testimonios</span>
          <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>Lo Que Dicen Nuestros Clientes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((r, i) => (
            <div key={i} className="review-card group glass-card p-8 transition-all duration-500 hover:-translate-y-1">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, si) => (
                  <Icons.Star key={si} size={14} className="text-[var(--star)] fill-[var(--star)]" />
                ))}
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7] mb-7">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-light)]">
                <div className="w-12 h-12 bg-[var(--blue)] text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0 rounded-xl">{r.initial}</div>
                <div>
                  <div className="text-[14px] font-bold text-[var(--text)]">{r.name}</div>
                  <div className="text-[12px] text-[var(--text-soft)]">{r.role} — {r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-row grid grid-cols-2 md:grid-cols-4 gap-4 glass-card p-8 md:p-10">
          {stats.map((s, i) => (
            <div key={i} className="stat-item text-center">
              <div className="text-[28px] sm:text-[32px] md:text-[38px] font-black text-[var(--blue)]" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.12em] mt-2 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
