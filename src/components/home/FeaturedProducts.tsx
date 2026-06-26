'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const featuredSkus = [
  'AO-ARK7710', 'AO-ACP300', 'AO-ALE1600G',
  'AO-CT1955', 'AO-104', 'AO-C288AT',
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll<HTMLElement>('.fp-card');
    gsap.set(items, { opacity: 0, y: 30 });
    gsap.to(items, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    });
  }, [mounted]);

  const products = (productsData as Array<{
    sku: string; name: string; slug: string; category: string; category_slug: string;
    subcategory: string; description: string; reference: string;
  }>).filter(p => featuredSkus.includes(p.sku));

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[var(--bg-alt)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[var(--blue)]" />
              <span className="text-[11px] font-semibold text-[var(--blue)] uppercase tracking-[0.18em]">Selección</span>
            </div>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>Productos Destacados</h2>
          </div>
          <Link href="/productos" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[11px] font-bold text-[var(--green)] uppercase tracking-[0.1em] hover:gap-3 transition-all">
            Ver Todo el Catálogo <Icons.ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <Link
              key={p.sku}
              href={`/productos/${p.slug}/`}
              className="fp-card group relative bg-white border border-[var(--border)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              {/* Image area */}
              <div className="relative h-[240px] bg-[var(--bg-alt)] overflow-hidden flex items-center justify-center p-6">
                <img
                  src={`/images/products/${p.sku}.jpg`}
                  alt={p.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-[var(--green)] text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 uppercase tracking-[0.12em]">
                  Destacado
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 w-9 h-9 bg-white border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-[var(--shadow)]">
                  <Icons.ArrowUpRight size={14} className="text-[var(--green)]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-[10px] font-semibold text-[var(--blue)] uppercase tracking-[0.12em]">{p.subcategory}</span>
                <h3 className="text-[15px] font-bold text-[var(--text)] mt-1.5 mb-1.5 leading-snug group-hover:text-[var(--green)] transition-colors line-clamp-2">{p.name}</h3>
                <p className="text-[12px] text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                  <span className="text-[10px] font-mono text-[var(--text-soft)]">{p.sku}</span>
                  <span className="text-[12px] font-bold text-[var(--green)] flex items-center gap-1">
                    Cotizar
                    <Icons.ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/productos" className="inline-flex items-center gap-3 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-10 py-4 hover:bg-[var(--green-hover)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(30,58,95,0.25)]">
            Ver Todo el Catálogo <Icons.ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
