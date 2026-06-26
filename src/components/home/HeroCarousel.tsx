'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const slides = [
  {
    tag: 'Líder en Equipamiento Oftálmico',
    title: 'Equipo profesional para tu consultorio',
    desc: 'Distribuidor autorizado de las mejores fábricas del mundo. Envío directo desde China a México con costos transparentes.',
    primaryCta: { label: 'Explorar Catálogo', href: '/productos' },
    secondaryCta: { label: 'Solicitar Cotización', href: '/contacto' },
    productImage: '/images/products/AO-ARK7710.jpg',
    productSku: 'AO-ARK7710',
  },
  {
    tag: 'Innovación Constante',
    title: 'Equipamiento de última generación',
    desc: 'Fábricas certificadas ISO 13485 con tecnología de vanguardia. Más de 116 productos disponibles.',
    primaryCta: { label: 'Ver Productos', href: '/productos' },
    secondaryCta: { label: 'Contactar', href: '/contacto' },
    productImage: '/images/products/AO-DPS700.jpg',
    productSku: 'AO-DPS700',
  },
  {
    tag: 'Envío a Todo México',
    title: 'Costos de envío en tiempo real',
    desc: 'Marítimo desde $4.50/kg. Aéreo desde $12/kg. Cotización instantánea según destino y peso.',
    primaryCta: { label: 'Calcular Envío', href: '/contacto' },
    secondaryCta: { label: 'Ver Catálogo', href: '/productos' },
    productImage: '/images/products/AO-BL66B.jpg',
    productSku: 'AO-BL66B',
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
    tl.fromTo('.hero-product-img', { opacity: 0, scale: 0.95, x: 20 }, { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');
  }, [i]);

  const s = slides[i];

  return (
    <section className="relative min-h-[90vh] bg-[var(--bg)] overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--blue)] opacity-[0.03] rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--green)] opacity-[0.02] rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[90vh] py-20">
          {/* Left — Text content */}
          <div className="relative z-10 max-w-[600px]">
            <div key={`tag-${i}`} className="hero-tag inline-flex items-center gap-2.5 mb-6">
              <div className="w-8 h-[2px] bg-[var(--blue)]" />
              <span className="text-[11px] font-semibold text-[var(--blue)] uppercase tracking-[0.18em]">{s.tag}</span>
            </div>

            <h1 key={`title-${i}`} className="hero-title text-[40px] md:text-[56px] lg:text-[64px] font-black text-[var(--text)] leading-[1.05] tracking-[-0.03em] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {s.title}
            </h1>

            <p key={`desc-${i}`} className="hero-desc text-[16px] md:text-[18px] text-[var(--text-muted)] leading-[1.7] mb-10 max-w-[480px]">
              {s.desc}
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-3">
              <Link href={s.primaryCta.href} className="hero-cta group inline-flex items-center justify-center gap-3 bg-[var(--green)] text-white font-bold text-[13px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-[var(--green-hover)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(30,58,95,0.25)]">
                {s.primaryCta.label}
                <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={s.secondaryCta.href} className="hero-cta group inline-flex items-center justify-center gap-2 text-[var(--text)] font-bold text-[13px] uppercase tracking-[0.08em] px-8 py-4 border border-[var(--border)] hover:border-[var(--text-muted)] transition-all duration-300">
                {s.secondaryCta.label}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="hero-cta flex items-center gap-8 mt-12 pt-8 border-t border-[var(--border-light)]">
              <div className="flex items-center gap-2.5">
                <Icons.ShieldCheck size={16} className="text-[var(--green)]" />
                <div>
                  <div className="text-[12px] font-bold text-[var(--text)]">Garantía 12 meses</div>
                  <div className="text-[10px] text-[var(--text-soft)]">Soporte incluido</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Icons.Truck size={16} className="text-[var(--blue)]" />
                <div>
                  <div className="text-[12px] font-bold text-[var(--text)]">Envío directo</div>
                  <div className="text-[10px] text-[var(--text-soft)]">China → México</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Icons.Tag size={16} className="text-[var(--amber)]" />
                <div>
                  <div className="text-[12px] font-bold text-[var(--text)]">Mejor precio</div>
                  <div className="text-[10px] text-[var(--text-soft)]">Directo de fábrica</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Product showcase */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div key={`product-${i}`} className="hero-product-img relative w-full max-w-[520px]">
              {/* Subtle background circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border border-[var(--border-light)]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full border border-[var(--border-light)] opacity-50" />
              </div>

              {/* Product image */}
              <div className="relative z-10 aspect-square flex items-center justify-center p-8">
                <img
                  src={s.productImage}
                  alt=""
                  className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                />
              </div>

              {/* Floating info card */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-[var(--border)] p-4 shadow-[var(--shadow-lg)] z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--green-light)] flex items-center justify-center">
                    <Icons.CheckCircle size={18} className="text-[var(--green)]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[var(--text)]">Stock Disponible</div>
                    <div className="text-[10px] text-[var(--text-soft)]">Envío inmediato</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="relative h-[3px] transition-all duration-500 overflow-hidden"
            style={{ width: idx === i ? 40 : 16, background: idx === i ? 'var(--green)' : 'var(--border)' }}
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
