'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const featuredSkus = [
  'AO-ARK7710', 'AO-FA6100CK', 'AO-DPS700',
  'AO-BL66B', 'AO-ALE1600G', 'AO-CT1000',
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll<HTMLElement>('.fp-card');
    gsap.set(items, { opacity: 0, y: 40, rotateX: 6 });
    gsap.to(items, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, [mounted]);

  const products = (productsData as Array<{
    sku: string; name: string; slug: string; category: string; category_slug: string;
    subcategory: string; description: string; reference: string;
  }>).filter(p => featuredSkus.includes(p.sku));

  return (
    <section ref={sectionRef} className="py-16 md:py-28 bg-[var(--bg-alt)] relative overflow-hidden beam-left beam-right">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--green)] opacity-[0.03] rounded-full blur-[120px]" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Selección</span>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>Productos Destacados</h2>
          </div>
          <Link href="/productos" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[11px] font-bold text-[var(--green)] uppercase tracking-[0.1em] hover:gap-3 transition-all">
            Ver Todo el Catálogo <Icons.ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: '1200px' }}>
          {products.map((p, idx) => (
            <Link
              key={p.sku}
              href={`/productos/${p.slug}/`}
              className="fp-card group relative bg-white border border-[var(--border)] hover:border-[var(--green)]/30 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,101,53,0.1)] hover:-translate-y-1"
            >
              {/* Image area */}
              <div className="relative h-[220px] overflow-hidden bg-[var(--bg-alt)]">
                <img
                  src={`/images/products/${p.sku}.jpg`}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Featured badge */}
                <div className="absolute top-3 left-3 bg-[var(--green)] text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-[0.12em]">
                  Destacado
                </div>

                {/* Hover CTA */}
                <div className="absolute bottom-3 right-3 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <Icons.ArrowUpRight size={14} className="text-[var(--green)]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-[9px] font-bold text-[var(--green)] uppercase tracking-[0.14em]">{p.subcategory}</span>
                <h3 className="text-[15px] font-bold text-[var(--text)] mt-1.5 mb-1.5 leading-tight group-hover:text-[var(--green)] transition-colors line-clamp-2">{p.name}</h3>
                <p className="text-[12px] text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[var(--text-soft)]">SKU:</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{p.sku}</span>
                  </div>
                  <span className="text-[12px] font-bold text-[var(--green)] flex items-center gap-1">
                    Cotizar
                    <Icons.ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/productos" className="inline-flex items-center gap-3 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.25)] hover:-translate-y-0.5">
            Ver Todo el Catálogo <Icons.ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
