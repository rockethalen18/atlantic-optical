'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const categories = [
  {
    name: 'Equipos Oftálmicos',
    slug: 'equipos-oftalmologia-optica',
    desc: 'Diagnóstico y tratamiento visual profesional',
    Icon: Icons.EyeRefractometer,
    count: 55,
    featuredSku: 'AO-ARK7710',
  },
  {
    name: 'Equipos de Laboratorio',
    slug: 'equipos-laboratorio',
    desc: 'Maquinaria de laboratorio óptico',
    Icon: Icons.Edger,
    count: 34,
    featuredSku: 'AO-ALE1600G',
  },
  {
    name: 'Mobiliario',
    slug: 'mobiliario',
    desc: 'Unidades y sillas oftálmicas',
    Icon: Icons.Phoropter,
    count: 12,
    featuredSku: 'AO-CT1000',
  },
  {
    name: 'Monitores y Optotipos',
    slug: 'monitores-optotipos',
    desc: 'Monitores LCD y proyectores',
    Icon: Icons.Eye,
    count: 15,
    featuredSku: 'AO-ACP300',
  },
];

export default function CategoryGrid() {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    const els = ref.current.querySelectorAll<HTMLElement>('.cat-card');
    gsap.set(els, { opacity: 0, y: 30 });
    gsap.to(els, {
      scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[var(--bg)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[var(--blue)]" />
              <span className="text-[11px] font-semibold text-[var(--blue)] uppercase tracking-[0.18em]">Explorar</span>
            </div>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>Categorías</h2>
          </div>
          <Link href="/productos" className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold text-[var(--green)] uppercase tracking-[0.1em] hover:gap-3 transition-all">
            Ver Catálogo Completo <Icons.ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?category=${c.slug}`}
              className="cat-card group relative bg-white border border-[var(--border)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              {/* Product image area */}
              <div className="relative h-[200px] bg-[var(--bg-alt)] overflow-hidden flex items-center justify-center p-6">
                <img
                  src={`/images/products/${c.featuredSku}.jpg`}
                  alt=""
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-[var(--green)] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 bg-[var(--bg-alt)] flex items-center justify-center group-hover:bg-[var(--green-light)] transition-colors duration-300">
                    <c.Icon size={16} className="text-[var(--green)]" />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-soft)] uppercase tracking-[0.1em]">{c.count} productos</span>
                </div>
                <h3 className="text-[16px] font-bold text-[var(--text)] mb-1 group-hover:text-[var(--green)] transition-colors">{c.name}</h3>
                <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">{c.desc}</p>

                {/* Arrow */}
                <div className="flex items-center gap-1.5 mt-4 text-[11px] font-bold text-[var(--green)] uppercase tracking-[0.08em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Ver productos <Icons.ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/productos" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--green)] uppercase tracking-[0.08em]">
            Ver Todas las Categorías <Icons.ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
