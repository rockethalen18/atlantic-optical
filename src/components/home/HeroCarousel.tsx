'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    image: '/images/hero-2.jpg',
    tag: 'Líder en Equipamiento Oftálmico',
    title: 'Phorópteros y equipo profesional',
    desc: 'Distribuidor autorizado de las mejores fábricas del mundo. Envío directo desde China a toda Latinoamérica.',
    cta: { label: 'Explorar Catálogo', href: '/productos' },
  },
  {
    image: '/images/hero-3.jpg',
    tag: 'Laboratorio Óptico Completo',
    title: 'Lentes de prueba y accesorios',
    desc: 'Set completo de lentes de prueba, monturas de prueba y todo lo que necesitas para tu consultorio.',
    cta: { label: 'Ver Productos', href: '/productos' },
  },
  {
    image: '/images/hero/hero-optical-equipment.jpg',
    tag: 'Calidad Certificada',
    title: 'Equipamiento de alta precisión',
    desc: 'Fábricas certificadas ISO 13485 con control de calidad riguroso. Más de 200 productos disponibles.',
    cta: { label: 'Conocer Más', href: '/oem-odm' },
  },
  {
    image: '/images/hero/eye-exam-machine.jpg',
    tag: 'Envío Directo',
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
    const t = setInterval(() => { if (!animating) goTo((i + 1) % slides.length); }, 5500);
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
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden -mt-[128px] md:-mt-[138px]">
      {slides.map((slide, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out" style={{ opacity: idx === i ? 1 : 0 }}>
          <img src={slide.image} alt={slide.tag} className="w-full h-full object-cover" style={{ transform: idx === i ? 'scale(1)' : 'scale(1.08)', transition: 'transform 6s ease-out' }} />
        </div>
      ))}

      {/* Light gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.1) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, white 0%, transparent 100%)' }} />

      <div className="relative z-10 max-w-[1680px] mx-auto px-6 md:px-10 h-full flex items-center">
        <div className="max-w-[620px]">
          <div key={`tag-${i}`} className="hero-tag inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-[var(--blue)]" />
            <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">{s.tag}</span>
          </div>

          <h1 key={`title-${i}`} className="hero-title text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-black text-[var(--text)] leading-[1.05] tracking-[-0.03em] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            {s.title}
          </h1>

          <p key={`desc-${i}`} className="hero-desc text-[15px] md:text-[17px] text-[var(--text-muted)] leading-[1.7] mb-10 max-w-[460px]">
            {s.desc}
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-3">
            <Link href={s.cta.href} className="hero-cta group inline-flex items-center justify-center gap-3 bg-[var(--blue)] text-white font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)]">
              {s.cta.label}
              <Icons.ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/productos" className="hero-cta inline-flex items-center justify-center gap-2 bg-white/70 backdrop-blur-md text-[var(--text)] font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 border border-[var(--border)] hover:border-[var(--blue)]/30 hover:bg-white transition-all duration-300">
              Ver Catálogo
            </Link>
          </div>

          <div className="hero-cta flex flex-wrap items-center gap-6 md:gap-10 mt-12 pt-8 border-t border-[var(--border-light)]">
            {[
              { icon: Icons.ShieldCheck, label: 'Garantía 18 meses', sub: 'Soporte incluido' },
              { icon: Icons.Truck, label: 'Envío directo', sub: 'China → Latinoamérica' },
              { icon: Icons.Tag, label: 'Mejor precio', sub: 'Directo de fábrica' },
            ].map((t, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <t.icon size={18} className="text-[var(--blue)]" />
                <div>
                  <div className="text-[12px] font-bold text-[var(--text)]">{t.label}</div>
                  <div className="text-[10px] text-[var(--text-soft)]">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goTo(idx)}
            className="h-[3px] transition-all duration-500 overflow-hidden relative"
            style={{ width: idx === i ? 40 : 16, background: idx === i ? 'var(--blue)' : 'var(--border)' }}
            aria-label={`Slide ${idx + 1}`}>
            {idx === i && <div className="absolute inset-0 bg-[var(--blue)]/30" style={{ animation: 'progressBar 5.5s linear' }} />}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes progressBar { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
      `}</style>
    </section>
  );
}
