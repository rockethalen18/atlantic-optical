'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    image: '/images/hero-optical-equipment.jpg',
    tag: 'Líder en Equipamiento Oftálmico',
    title: 'Equipo profesional para tu consultorio',
    desc: 'Distribuidor autorizado de las mejores fábricas del mundo. Envío directo desde China a toda Latinoamérica.',
    cta: { label: 'Explorar Catálogo', href: '/productos' },
  },
  {
    image: '/images/hero-optical-store.jpg',
    tag: 'Nuevas Colecciones',
    title: 'Monturas de última tendencia',
    desc: 'Exclusivas colecciones de monturas ópticas y lentes de sol con diseño contemporáneo.',
    cta: { label: 'Ver Colecciones', href: '/productos' },
  },
  {
    image: '/images/hero-eye-exam.jpg',
    tag: 'Innovación Constante',
    title: 'Equipamiento de última generación',
    desc: 'Fábricas certificadas ISO 13485 con tecnología de vanguardia. Más de 116 productos.',
    cta: { label: 'Ver Productos', href: '/productos' },
  },
  {
    image: '/images/hero-glasses-display.jpg',
    tag: 'Envío a Toda Latinoamérica',
    title: 'Costos de envío en tiempo real',
    desc: 'Marítimo desde $4.50/kg. Aéreo desde $12/kg. Cotización según destino y peso.',
    cta: { label: 'Calcular Envío', href: '/contacto' },
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
    const t = setInterval(() => { if (!animating) goTo((i + 1) % slides.length); }, 6000);
    return () => clearInterval(t);
  }, [i, animating, goTo]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.hero-tag', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' });
    tl.fromTo('.hero-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    tl.fromTo('.hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2');
    tl.fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, '-=0.2');
  }, [i]);

  const s = slides[i];

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] bg-[#0a1628] overflow-hidden">
      {slides.map((slide, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out" style={{ opacity: idx === i ? 1 : 0 }}>
          <img src={slide.image} alt={slide.tag} className="w-full h-full object-cover scale-105" style={{ transform: idx === i ? 'scale(1)' : 'scale(1.05)', transition: 'transform 6s ease-out' }} />
        </div>
      ))}

      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.3) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: 'linear-gradient(to top, rgba(10,22,40,1) 0%, transparent 100%)' }} />

      <div className="relative z-10 max-w-[1680px] mx-auto px-6 md:px-10 h-full flex items-center pt-[80px] md:pt-[90px]">
        <div className="max-w-[650px]">
          <div key={`tag-${i}`} className="hero-tag inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-[var(--blue)]" />
            <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">{s.tag}</span>
          </div>

          <h1 key={`title-${i}`} className="hero-title text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-black text-white leading-[1.05] tracking-[-0.03em] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            {s.title}
          </h1>

          <p key={`desc-${i}`} className="hero-desc text-[15px] md:text-[17px] text-white/60 leading-[1.7] mb-10 max-w-[480px]">
            {s.desc}
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-3">
            <Link href={s.cta.href} className="hero-cta group inline-flex items-center justify-center gap-3 bg-[var(--blue)] text-white font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(37,99,235,0.35)]">
              {s.cta.label}
              <Icons.ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contacto" className="hero-cta inline-flex items-center justify-center gap-2 text-white font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300">
              Cotización Gratis
            </Link>
          </div>

          <div className="hero-cta flex flex-wrap items-center gap-6 md:gap-10 mt-12 pt-8 border-t border-white/10">
            {[
              { icon: Icons.ShieldCheck, label: 'Garantía 12 meses', sub: 'Soporte incluido' },
              { icon: Icons.Truck, label: 'Envío directo', sub: 'China → Latinoamérica' },
              { icon: Icons.Tag, label: 'Mejor precio', sub: 'Directo de fábrica' },
            ].map((t, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <t.icon size={18} className="text-[var(--blue)]" />
                <div>
                  <div className="text-[12px] font-bold text-white">{t.label}</div>
                  <div className="text-[10px] text-white/40">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goTo(idx)}
            className="h-[3px] transition-all duration-500 overflow-hidden"
            style={{ width: idx === i ? 40 : 16, background: idx === i ? 'var(--blue)' : 'rgba(255,255,255,0.2)' }}
            aria-label={`Slide ${idx + 1}`}>
            {idx === i && <div className="absolute inset-0 bg-white/30" style={{ animation: 'progressBar 6s linear' }} />}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes progressBar { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
      `}</style>
    </section>
  );
}
