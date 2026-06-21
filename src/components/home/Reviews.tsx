'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const reviews = [
  { name: 'Dr. Carlos Méndez', role: 'Oftalmólogo — CDMX', text: 'Excelente calidad en todos los equipos. El soporte post-venta es excepcional. Ya realizamos 3 compras con Atlantic Optical.', rating: 5, initial: 'CM' },
  { name: 'Dra. María García', role: 'Optometrista — Guadalajara', text: 'El foróptero ATF-5000 superó nuestras expectativas. Precisión clínica y diseño profesional. Totalmente recomendado.', rating: 5, initial: 'MG' },
  { name: 'Ing. Roberto Sánchez', role: 'Director de Laboratorio — Monterrey', text: 'El envío fue rápido y el equipo llegó en perfecto estado. Los costos variables son muy transparentes y justos.', rating: 5, initial: 'RS' },
];

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.review-card');
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 30, rotateY: -5 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, rotateY: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--bg)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="wow-fadeUp text-center mb-10">
          <span className="text-[10px] font-semibold text-[var(--green)] uppercase tracking-[0.18em]">Testimonios</span>
          <h2 className="text-[28px] md:text-[38px] font-black text-[var(--text)] tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Lo Que Dicen Nuestros Clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ perspective: '1000px' }}>
          {reviews.map((r, i) => (
            <div key={i} className="review-card bg-white border border-[var(--border)] p-6 hover:border-[var(--green)]/30 transition-colors">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, si) => (
                  <Icons.Star key={si} size={14} className="text-[var(--star)] fill-[var(--star)]" />
                ))}
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65] mb-5">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-light)]">
                <div className="w-9 h-9 bg-[var(--green)] text-white flex items-center justify-center text-[11px] font-bold rounded-full">{r.initial}</div>
                <div>
                  <div className="text-[13px] font-bold text-[var(--text)]">{r.name}</div>
                  <div className="text-[11px] text-[var(--text-soft)]">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
