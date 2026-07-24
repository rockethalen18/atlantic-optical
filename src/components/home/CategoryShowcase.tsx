'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';

const categories = [
  { name: 'Auto Refractómetros', slug: 'auto-refractometros-con-keratometro', icon: '🔍', desc: 'Diagnóstico precisos', count: '12+ modelos' },
  { name: 'Forópteros', slug: 'foropteros-manuales', icon: '👁️', desc: 'Examen subjetivo', count: '8+ modelos' },
  { name: 'Lámparas de Hendidura', slug: 'lamparas-de-hendidura', icon: '💡', desc: 'Iluminación profesional', count: '10+ modelos' },
  { name: 'Tonómetros', slug: 'tonometros-de-contacto', icon: '🩺', desc: 'Medición de presión', count: '6+ modelos' },
  { name: 'Biseladoras', slug: 'biseladoras-automaticas', icon: '⚙️', desc: 'Laboratorio óptico', count: '15+ modelos' },
  { name: 'Mobiliario', slug: 'sillas-con-pedal', icon: '🏥', desc: 'Consultorios modernos', count: '20+ modelos' },
];

export default function CategoryShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>('.cat-card');

    // 3D tilt on mouse move
    cards.forEach((card) => {
      const handleMouse = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        gsap.to(card, {
          rotateX, rotateY,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out',
          boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(14,165,233,0.15)`,
        });
      };

      const handleLeave = () => {
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          duration: 0.6,
          ease: 'power3.out',
        });
      };

      card.addEventListener('mousemove', handleMouse);
      card.addEventListener('mouseleave', handleLeave);
      return () => {
        card.removeEventListener('mousemove', handleMouse);
        card.removeEventListener('mouseleave', handleLeave);
      };
    });

    // Stagger reveal
    gsap.fromTo(cards,
      { opacity: 0, y: 60, rotateX: 15, scale: 0.9 },
      {
        opacity: 1, y: 0, rotateX: 0, scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [mounted]);

  return (
    <section ref={ref} className="py-24 md:py-36 bg-white">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Explora por Categoría</span>
          <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            Equipos que Transforman
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
          {categories.map((cat, i) => (
            <Link key={i} href={`/productos?subcategory=${cat.slug}`} className="cat-card group block bg-white border border-[var(--border)] p-8 md:p-10 relative overflow-hidden hover:border-[var(--blue)]/30 transition-colors" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blue)] opacity-[0.03] rounded-full blur-[60px] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-700" />
              <div className="text-[48px] mb-4 block" style={{ transform: 'translateZ(30px)' }}>{cat.icon}</div>
              <h3 className="text-[18px] font-bold text-[var(--text)] mb-1 group-hover:text-[var(--blue)] transition-colors" style={{ transform: 'translateZ(20px)' }}>{cat.name}</h3>
              <p className="text-[14px] text-[var(--text-muted)] mb-4">{cat.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[var(--blue)] bg-[var(--blue-light)] px-3 py-1">{cat.count}</span>
                <span className="text-[12px] font-bold text-[var(--text-soft)] group-hover:text-[var(--blue)] group-hover:translate-x-1 transition-all flex items-center gap-1">
                  Ver más <span className="text-[16px]">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
