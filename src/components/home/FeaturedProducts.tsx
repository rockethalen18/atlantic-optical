'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const featuredSkus = ['AO-ARK7710', 'AO-ACP300', 'AO-ALE1600G', 'AO-CT1955', 'AO-104', 'AO-C288AT'];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll<HTMLElement>('.fp-card');
    gsap.set(items, { opacity: 0, y: 50 });
    gsap.to(items, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    });
  }, [mounted]);

  const products = (productsData as Array<{
    sku: string; name: string; slug: string; category: string; category_slug: string;
    subcategory: string; description: string; reference: string;
  }>).filter(p => featuredSkus.includes(p.sku));

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-white">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Selección</span>
            <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em] leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>Productos Destacados</h2>
          </div>
          <Link href="/productos" className="mt-5 md:mt-0 inline-flex items-center gap-2 bg-[var(--dark-bg)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-8 py-3.5 hover:bg-[var(--dark-surface)] transition-all duration-300">
            Ver Catálogo Completo <Icons.ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((p) => (
            <Link key={p.sku} href={`/productos/${p.slug}/`}
              className="fp-card group block bg-[var(--bg-alt)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2">
              <div className="relative h-[300px] bg-white overflow-hidden flex items-center justify-center p-8">
                <img src={`/images/products/${p.sku}.jpg`} alt={p.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-[var(--dark-bg)] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-[0.12em]">
                  Destacado
                </div>
                <div className="absolute bottom-4 right-4 w-11 h-11 bg-[var(--blue)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                  <Icons.ArrowUpRight size={16} className="text-white" />
                </div>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-[0.14em]">{p.subcategory}</span>
                <h3 className="text-[16px] font-bold text-[var(--text)] mt-2 mb-2 leading-snug group-hover:text-[var(--blue)] transition-colors line-clamp-2">{p.name}</h3>
                <p className="text-[13px] text-[var(--text-muted)] line-clamp-2 mb-5 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
                  <span className="text-[11px] font-mono text-[var(--text-soft)]">{p.sku}</span>
                  <span className="text-[12px] font-bold text-[var(--blue)] flex items-center gap-1.5">Cotizar <Icons.ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/productos" className="inline-flex items-center gap-3 bg-[var(--blue)] text-white font-bold text-[13px] uppercase tracking-[0.1em] px-12 py-4.5 hover:bg-[var(--blue-hover)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)]">
            Ver Todo el Catálogo <Icons.ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
