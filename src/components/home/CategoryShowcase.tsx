'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';

const categories = [
  { name: 'Auto Refractómetros', slug: 'auto-refractometros-con-keratometro', image: '/images/extracted_images/AO-ARK7710.jpg', desc: 'Diagnóstico preciso con keratometría', count: '12+ modelos' },
  { name: 'Forópteros', slug: 'foropteros-manuales', image: '/images/extracted_images/AO-CT1504.jpg', desc: 'Examen subjetivo automatizado', count: '8+ modelos' },
  { name: 'Lámparas de Hendidura', slug: 'lamparas-de-hendidura', image: '/images/extracted_images/AO-ML5S1.jpg', desc: 'Iluminación profesional de precisión', count: '10+ modelos' },
  { name: 'Tonómetros', slug: 'tonometros-de-contacto', image: '/images/extracted_images/AO-SK5500A.jpg', desc: 'Medición intraocular confiable', count: '6+ modelos' },
  { name: 'Biseladoras Automáticas', slug: 'biseladoras-automaticas', image: '/images/extracted_images/AO-ALE1000.jpg', desc: 'Laboratorio óptico de alta gama', count: '15+ modelos' },
  { name: 'Mobiliario Clínico', slug: 'sillas-con-pedal', image: '/images/extracted_images/AO-CT1955.jpg', desc: 'Consultorios y clínicas modernas', count: '20+ modelos' },
];

export default function CategoryShowcase() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>('.cat-card');

    cards.forEach((card) => {
      const img = card.querySelector<HTMLElement>('.cat-img');
      const handleMouse = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: x * 6,
          rotateX: -y * 6,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out',
        });
        if (img) {
          gsap.to(img, { x: x * 8, y: y * 8, scale: 1.04, duration: 0.5, ease: 'power2.out' });
        }
      };
      const handleLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
        if (img) gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
      };
      card.addEventListener('mousemove', handleMouse);
      card.addEventListener('mouseleave', handleLeave);
    });

    gsap.fromTo(cards,
      { opacity: 0, y: 60, rotateX: 12 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none none' },
      }
    );
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-36 glass-section">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[var(--blue)]" />
            <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Explora por Categoría</span>
            <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-[var(--blue)]" />
          </div>
          <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            Equipos que Transforman
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" style={{ perspective: '1200px' }}>
          {categories.map((cat, i) => (
            <Link key={i} href={`/productos?subcategory=${cat.slug}`}
              className="cat-card group block glass-premium p-6 relative"
              style={{ transformStyle: 'preserve-3d' }}>

              <div className="glass-img relative h-[220px] mb-5">
                <img src={cat.image} alt={cat.name}
                  className="cat-img w-full h-full object-contain p-5 transition-transform duration-700 group-hover:scale-110" />
              </div>

              <h3 className="text-[17px] font-bold text-[var(--text)] mb-1.5 group-hover:text-[var(--blue)] transition-colors duration-300">{cat.name}</h3>
              <p className="text-[13px] text-[var(--text-muted)] mb-5 leading-[1.6]">{cat.desc}</p>

              <div className="flex items-center justify-between">
                <span className="glass-chip text-[11px] font-bold text-[var(--blue)] px-3.5 py-1.5">{cat.count}</span>
                <span className="text-[12px] font-bold text-[var(--text-soft)] group-hover:text-[var(--blue)] group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1">
                  Ver más <span className="text-[15px] transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
