'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    image: '/images/products/AO-ARK7710.jpg',
    tag: 'Auto Refractómetro',
    title: 'Diagnóstico visual de alta precisión',
    desc: 'Tecnología avanzada con keratometría integrada. Resultados instantáneos para tu consultorio.',
    cta: { label: 'Ver Producto', href: '/productos/auto-refractometros-con-keratometro' },
  },
  {
    image: '/images/products/AO-ALE1000.jpg',
    tag: 'Biseladora Automática',
    title: 'Laboratorio óptico de nueva generación',
    desc: 'Biselado automático con escáner. Precisión milimétrica para todo tipo de micas.',
    cta: { label: 'Ver Producto', href: '/productos/biseladoras-automaticas' },
  },
  {
    image: '/images/products/AO-CT1955.jpg',
    tag: 'Mobiliario Clínico',
    title: 'Consultorios que inspiran confianza',
    desc: 'Sillas con pedal de elevación y mesas multifuncionales. Diseño ergonómico profesional.',
    cta: { label: 'Ver Mobiliario', href: '/productos?category=mobiliario' },
  },
  {
    image: '/images/products/AO-SJ350.jpg',
    tag: 'Lámpara de Hendidura',
    title: 'Iluminación profesional de precisión',
    desc: 'LED de alta intensidad con filtros cobalt y verde. El estándar en oftalmología.',
    cta: { label: 'Ver Producto', href: '/productos/lamparas-de-hendidura' },
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
    const t = setInterval(() => { if (!animating) goTo((i + 1) % slides.length); }, 5000);
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
    <section className="relative h-screen min-h-[600px] max-h-[900px] bg-gradient-to-br from-[var(--bg-alt)] via-white to-[var(--bg-alt)] overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80 z-[1]" />

      {slides.map((slide, idx) => (
        <div key={idx} className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out" style={{ opacity: idx === i ? 1 : 0 }}>
          <img src={slide.image} alt={slide.tag} className="absolute right-[5%] md:right-[8%] top-1/2 -translate-y-1/2 h-[55%] md:h-[70%] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]" style={{ transform: `translateY(-50%) scale(${idx === i ? 1 : 0.95})`, transition: 'transform 6s ease-out' }} />
        </div>
      ))}

      <div className="relative z-10 max-w-[1680px] mx-auto px-6 md:px-10 h-full flex items-center pt-[80px] md:pt-[90px]">
        <div className="max-w-[600px]">
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
            <Link href="/productos" className="hero-cta inline-flex items-center justify-center gap-2 text-[var(--text)] font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4 border border-[var(--border)] hover:border-[var(--blue)]/30 hover:bg-[var(--blue-light)] transition-all duration-300">
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
            className="h-[3px] transition-all duration-500 overflow-hidden"
            style={{ width: idx === i ? 40 : 16, background: idx === i ? 'var(--blue)' : 'var(--border)' }}
            aria-label={`Slide ${idx + 1}`}>
            {idx === i && <div className="absolute inset-0 bg-[var(--blue)]/30" style={{ animation: 'progressBar 5s linear' }} />}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes progressBar { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
      `}</style>
    </section>
  );
}
