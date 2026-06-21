'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    bg: '#006535',
    gradient: 'linear-gradient(135deg, #01582c 0%, #006535 40%, #00804a 100%)',
    img: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=1400&q=85',
    tag: 'Líder en Equipamiento',
    titlePrefix: '',
    titleWords: ['Tu', 'proveedor', 'de', 'confianza', 'en', 'equipo', 'oftálmico', 'y', 'optométrico'],
    desc: 'Cubrimos las necesidades de profesionales de la salud visual con equipo de las mejores fábricas.',
    primaryCta: { label: 'Explorar Productos', href: '/productos' },
    secondaryCta: { label: 'Contactar Ahora', href: '/contacto' },
  },
  {
    bg: '#1d1d1f',
    gradient: 'linear-gradient(135deg, #0d0d0e 0%, #1d1d1f 40%, #2d2d2f 100%)',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85',
    tag: 'Innovación Constante',
    titlePrefix: '',
    titleWords: ['Equipamiento', 'de', 'última', 'generación', 'para', 'tu', 'consultorio'],
    desc: 'Las mejores fábricas. Envío directo a México con costos transparentes.',
    primaryCta: { label: 'Ver Catálogo', href: '/productos' },
    secondaryCta: { label: 'Solicitar Cotización', href: '/contacto' },
  },
  {
    bg: '#1d1d1f',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1d1d1f 40%, #2d2d2f 100%)',
    img: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1400&q=85',
    tag: 'Envío México',
    titlePrefix: '',
    titleWords: ['Costos', 'de', 'envío', 'variables', 'tiempo', 'real', 'China', 'a', 'México'],
    desc: 'Transporte marítimo y aéreo con cotización instantánea y transparente.',
    primaryCta: { label: 'Calcular Envío', href: '/contacto' },
    secondaryCta: { label: 'Más Información', href: '/productos' },
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [animating, setA] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    slides.forEach((s, idx) => {
      const img = new window.Image();
      img.onload = () => setImgLoaded((p) => { const n = [...p]; n[idx] = true; return n; });
      img.src = s.img;
    });
  }, []);

  const goTo = useCallback((next: number) => {
    if (animating || next === i) return;
    setA(true);
    setI(next);
    setTimeout(() => setA(false), 900);
  }, [animating, i]);

  useEffect(() => {
    const t = setInterval(() => {
      if (!animating) goTo((i + 1) % slides.length);
    }, 6500);
    return () => clearInterval(t);
  }, [i, animating, goTo]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.hero-title-word');
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 35, skewY: 5 });
    gsap.to(els, {
      opacity: 1, y: 0, skewY: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: 'power4.out',
      delay: 0.5,
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
    <section id="hero" className="relative min-h-[100vh] md:min-h-[100vh] overflow-hidden flex items-center">
      <div className="absolute inset-0">
        {imgLoaded[i] ? (
          <img key={`bg-${i}`} src={s.img} alt="" className="w-full h-full object-cover ken-burns" style={{ objectPosition: '60% 40%' }} />
        ) : (
          <div className="w-full h-full" style={{ background: s.gradient }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.12) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 40%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-16">
        <div className="hero-content-inner max-w-[600px]">
          <div key={`tag-${i}`} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 mb-6 border border-white/20 rounded-sm">
            <Icons.Sparkles size={11} className="text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.16em]">{s.tag}</span>
          </div>

          <h1 key={`title-${i}`} className="text-[40px] md:text-[56px] font-black leading-[0.96] tracking-[-0.04em] mb-5 text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {s.titleWords.map((w, wi) => (
              <span key={wi} className="hero-title-word inline-block mr-[0.28em]">{w}</span>
            ))}
          </h1>

          <p key={`desc-${i}`} className="text-[15px] md:text-[16px] text-white/75 leading-[1.65] mb-8 max-w-[460px]">
            {s.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={s.primaryCta.href} className="inline-flex items-center justify-center gap-2.5 bg-white text-[var(--text)] font-bold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 hover:bg-white/90 transition-all">
              {s.primaryCta.label} <Icons.ArrowRight size={14} />
            </Link>
            <Link href={s.secondaryCta.href} className="inline-flex items-center justify-center gap-2.5 bg-white/10 text-white border border-white/20 font-bold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 hover:bg-white/20 backdrop-blur transition-all">
              {s.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-white/10">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => goTo(idx)} className={`block h-[2px] rounded-full transition-all duration-500 ${idx === i ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
        <div key={`scroll-${i}`} className="text-white/50 text-[9px] font-semibold tracking-[0.22em] uppercase mt-1 animate-bounce">
          Scroll
        </div>
      </div>
    </section>
  );
}
