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
  const cardsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const items = cards.querySelectorAll<HTMLElement>('.product-card');
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 40, rotateX: 8 });
    gsap.to(items, {
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--bg-alt)] relative overflow-hidden beam-left beam-right">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="wow-fadeUp flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[10px] font-semibold text-[var(--green)] uppercase tracking-[0.18em]">Más Popular</span>
            <h2 className="text-[28px] md:text-[38px] font-black text-[var(--text)] tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>Productos Destacados</h2>
          </div>
          <Link href="/productos" className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--green)] uppercase tracking-[0.08em]">
            Ver Todo <Icons.ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div ref={cardsRef} className="max-w-[1680px] mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p) => (
          <Link key={p.sku} href={`/productos?category=${p.category_slug}`} className="product-card group bg-white border border-[var(--border)] hover:border-[var(--green)]/30 transition-all duration-300 overflow-hidden" style={{ perspective: '1000px' }}>
            <div className="relative h-[200px] overflow-hidden bg-[var(--bg-alt)]">
              <img src={`/images/products/${p.sku}.jpg`} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute top-3 left-3 bg-[var(--green)] text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-[0.1em]">Destacado</span>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-semibold text-[var(--green)] uppercase tracking-[0.12em]">{p.subcategory}</span>
              <h3 className="text-[14px] font-bold text-[var(--text)] mt-1 mb-1 leading-tight group-hover:text-[var(--green)] transition-colors">{p.name}</h3>
              <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mb-2">{p.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                <span className="text-[13px] font-bold text-[var(--green)]">Cotizar</span>
                <Icons.ArrowUpRight size={14} className="text-[var(--text-soft)] group-hover:text-[var(--green)] transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 mt-10 text-center">
        <Link href="/productos" className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3 hover:bg-[var(--green-hover)] transition-colors">
          Ver Todo el Catálogo <Icons.ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
