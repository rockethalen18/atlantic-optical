'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    gradient: 'linear-gradient(135deg, #01582c 0%, #006535 35%, #00804a 70%, #00a86b 100%)',
    tag: 'Líder en Equipamiento',
    titleWords: ['Tu', 'proveedor', 'de', 'confianza', 'en', 'equipo', 'oftálmico'],
    desc: 'Cubrimos las necesidades de profesionales de la salud visual con equipo de las mejores fábricas del mundo.',
    primaryCta: { label: 'Explorar Productos', href: '/productos' },
    secondaryCta: { label: 'Contactar Ahora', href: '/contacto' },
    accent: '#00a86b',
  },
  {
    gradient: 'linear-gradient(135deg, #0d0d0e 0%, #1a1a2e 35%, #16213e 70%, #0f3460 100%)',
    tag: 'Innovación Constante',
    titleWords: ['Equipamiento', 'de', 'última', 'generación', 'para', 'tu', 'consultorio'],
    desc: 'Las mejores fábricas certificadas ISO 13485. Envío directo a México con costos 100% transparentes.',
    primaryCta: { label: 'Ver Catálogo', href: '/productos' },
    secondaryCta: { label: 'Solicitar Cotización', href: '/contacto' },
    accent: '#4facfe',
  },
  {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #0f3460 70%, #533483 100%)',
    tag: 'Envío México',
    titleWords: ['Costos', 'de', 'envío', 'variables', 'en', 'tiempo', 'real'],
    desc: 'Transporte marítimo y aéreo con cotización instantánea. China a tu consultorio en México.',
    primaryCta: { label: 'Calcular Envío', href: '/contacto' },
    secondaryCta: { label: 'Ver Productos', href: '/productos' },
    accent: '#a855f7',
  },
];

function FloatingOrb({ delay, x, y, size, color }: { delay: number; x: number; y: number; size: number; color: string }) {
  return (
    <div
      className="absolute rounded-full opacity-20 animate-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + delay}s`,
      }}
    />
  );
}

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [animating, setA] = useState(false);

  const goTo = useCallback((next: number) => {
    if (animating || next === i) return;
    setA(true);
    setI(next);
    setTimeout(() => setA(false), 900);
  }, [animating, i]);

  useEffect(() => {
    const t = setInterval(() => {
      if (!animating) goTo((i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(t);
  }, [i, animating, goTo]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.hero-title-word');
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 40, skewY: 4 });
    gsap.to(els, {
      opacity: 1, y: 0, skewY: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power4.out',
      delay: 0.4,
    });
  }, [i]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.hero-fade');
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 20 });
    gsap.to(els, {
      opacity: 1, y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.8,
    });
  }, [i]);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const y = window.scrollY;
      gsap.set(hero, { y: y * 0.15 });
      gsap.to('.hero-content-inner', { opacity: 1 - y / 700, duration: 0 });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const s = slides[i];

  return (
    <section id="hero" className="relative min-h-[100vh] overflow-hidden flex items-center">
      <div className="absolute inset-0 transition-all duration-1000" style={{ background: s.gradient }} />

      {/* Floating orbs */}
      <FloatingOrb delay={0} x={75} y={20} size={300} color={s.accent} />
      <FloatingOrb delay={2} x={85} y={60} size={200} color={s.accent} />
      <FloatingOrb delay={4} x={60} y={70} size={250} color={s.accent} />
      <FloatingOrb delay={1} x={20} y={30} size={180} color="rgba(255,255,255,0.3)" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />

      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-16">
        <div className="hero-content-inner max-w-[640px]">
          <div key={`tag-${i}`} className="hero-fade inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 mb-6 border border-white/15">
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ color: s.accent }} />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.18em]">{s.tag}</span>
          </div>

          <h1 key={`title-${i}`} className="text-[42px] md:text-[60px] font-black leading-[0.95] tracking-[-0.04em] mb-6 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {s.titleWords.map((w, wi) => (
              <span key={wi} className="hero-title-word inline-block mr-[0.28em]">{w}</span>
            ))}
          </h1>

          <p key={`desc-${i}`} className="hero-fade text-[15px] md:text-[17px] text-white/70 leading-[1.7] mb-10 max-w-[480px]">
            {s.desc}
          </p>

          <div className="hero-fade flex flex-col sm:flex-row gap-3">
            <Link href={s.primaryCta.href} className="group inline-flex items-center justify-center gap-3 bg-white text-[var(--text)] font-bold text-[13px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-white/90 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              {s.primaryCta.label}
              <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={s.secondaryCta.href} className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 font-bold text-[13px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-white/20 backdrop-blur transition-all">
              {s.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 border border-white/10">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => goTo(idx)} className="relative h-[3px] rounded-full transition-all duration-500 overflow-hidden" style={{ width: idx === i ? 32 : 12, background: idx === i ? 'white' : 'rgba(255,255,255,0.3)' }}>
              {idx === i && (
                <div className="absolute inset-0 bg-white/50" style={{ animation: 'progressBar 7s linear' }} />
              )}
            </button>
          ))}
        </div>
        <div key={`scroll-${i}`} className="text-white/40 text-[9px] font-semibold tracking-[0.22em] uppercase mt-1 animate-bounce">
          Scroll
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
