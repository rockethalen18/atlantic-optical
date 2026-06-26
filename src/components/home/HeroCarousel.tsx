'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    image: '/images/hero-optical-equipment.jpg',
    alt: 'Equipo oftalmológico profesional - autorefractómetro y lámpara de hendidura',
    tag: 'Líder en Equipamiento Oftálmico',
    title: 'Equipo profesional para tu consultorio',
    desc: 'Distribuidor autorizado de las mejores fábricas del mundo. Envío directo desde China a México.',
    primaryCta: { label: 'Explorar Catálogo', href: '/productos' },
    secondaryCta: { label: 'Solicitar Cotización', href: '/contacto' },
  },
  {
    image: '/images/hero-optical-store.jpg',
    alt: 'Local de óptica con exhibidor de monturas y lentes',
    tag: 'Nuevas Colecciones',
    title: 'Monturas de última tendencia',
    desc: 'Exclusivas colecciones de monturas ópticas y lentes de sol con diseño contemporáneo.',
    primaryCta: { label: 'Ver Colecciones', href: '/productos' },
    secondaryCta: { label: 'Contactar', href: '/contacto' },
  },
  {
    image: '/images/hero-eye-exam.jpg',
    alt: 'Examen visual con equipo oftalmológico de última generación',
    tag: 'Innovación Constante',
    title: 'Equipamiento de última generación',
    desc: 'Fábricas certificadas ISO 13485 con tecnología de vanguardia. Más de 116 productos.',
    primaryCta: { label: 'Ver Productos', href: '/productos' },
    secondaryCta: { label: 'Nuestra Empresa', href: '/nosotros' },
  },
  {
    image: '/images/hero-glasses-display.jpg',
    alt: 'Exhibición de lentes y monturas ópticas de diseñador',
    tag: 'Envío a Todo México',
    title: 'Costos de envío en tiempo real',
    desc: 'Marítimo desde $4.50/kg. Aéreo desde $12/kg. Cotización según destino y peso.',
    primaryCta: { label: 'Calcular Envío', href: '/contacto' },
    secondaryCta: { label: 'Ver Catálogo', href: '/productos' },
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [animating, setA] = useState(false);

  const goTo = useCallback((next: number) => {
    if (animating || next === i) return;
    setA(true);
    setI(next);
    setTimeout(() => setA(false), 700);
  }, [animating, i]);

  useEffect(() => {
    const t = setInterval(() => {
      if (!animating) goTo((i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [i, animating, goTo]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.hero-tag', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    tl.fromTo('.hero-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    tl.fromTo('.hero-desc', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3');
    tl.fromTo('.hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, '-=0.2');
  }, [i]);

  const s = slides[i];

  return (
    <section className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] bg-[#0a1628] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: idx === i ? 1 : 0 }}
        >
          <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative z-10 max-w-[1680px] mx-auto px-5 sm:px-6 md:px-10 h-full flex items-center pt-[60px] lg:pt-[106px]">
        <div className="max-w-[600px]">
          <div key={`tag-${i}`} className="hero-tag inline-flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6">
            <div className="w-6 sm:w-8 h-[2px] bg-[#60a5fa]" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#60a5fa] uppercase tracking-[0.18em]">{s.tag}</span>
          </div>

          <h1 key={`title-${i}`} className="hero-title text-[28px] sm:text-[36px] md:text-[48px] lg:text-[60px] font-black text-white leading-[1.08] tracking-[-0.02em] mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            {s.title}
          </h1>

          <p key={`desc-${i}`} className="hero-desc text-[13px] sm:text-[15px] md:text-[16px] text-white/70 leading-[1.6] sm:leading-[1.7] mb-6 sm:mb-10 max-w-[450px]">
            {s.desc}
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-8 sm:mb-0">
            <Link href={s.primaryCta.href} className="hero-cta group inline-flex items-center justify-center gap-2.5 bg-[var(--blue)] text-white font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.08em] px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(37,99,235,0.3)]">
              {s.primaryCta.label}
              <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={s.secondaryCta.href} className="hero-cta group inline-flex items-center justify-center gap-2 text-white font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.08em] px-6 sm:px-8 py-3.5 sm:py-4 border border-white/25 hover:border-white/50 hover:bg-white/10 transition-all duration-300">
              {s.secondaryCta.label}
            </Link>
          </div>

          {/* Trust indicators - wrapped on mobile */}
          <div className="hero-cta flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-white/15">
            <div className="flex items-center gap-2">
              <Icons.ShieldCheck size={15} className="text-[#60a5fa] shrink-0" />
              <div>
                <div className="text-[11px] sm:text-[12px] font-bold text-white">Garantía 12 meses</div>
                <div className="text-[9px] sm:text-[10px] text-white/50">Soporte incluido</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Truck size={15} className="text-[#60a5fa] shrink-0" />
              <div>
                <div className="text-[11px] sm:text-[12px] font-bold text-white">Envío directo</div>
                <div className="text-[9px] sm:text-[10px] text-white/50">China → México</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Tag size={15} className="text-[#d4a843] shrink-0" />
              <div>
                <div className="text-[11px] sm:text-[12px] font-bold text-white">Mejor precio</div>
                <div className="text-[9px] sm:text-[10px] text-white/50">Directo de fábrica</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots - larger touch targets */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="relative h-2.5 sm:h-[3px] transition-all duration-500 overflow-hidden flex items-center justify-center"
            style={{ width: idx === i ? 32 : 12, background: idx === i ? 'var(--green)' : 'rgba(255,255,255,0.3)' }}
            aria-label={`Slide ${idx + 1}`}
          >
            {idx === i && (
              <div className="absolute inset-0 bg-[var(--green)]/50" style={{ animation: 'progressBar 6s linear' }} />
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </section>
  );
}
