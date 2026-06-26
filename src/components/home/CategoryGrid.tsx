'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const categories = [
  {
    name: 'Equipos Oftálmicos y Ópticos',
    slug: 'equipos-oftalmologia-optica',
    desc: 'Diagnóstico y tratamiento visual profesional',
    Icon: Icons.EyeRefractometer,
    gradient: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 50%, #2563eb 100%)',
    accent: 'rgba(37,99,235,0.15)',
    count: 55,
    size: 'lg' as const,
    featuredSku: 'AO-ARK7710',
  },
  {
    name: 'Equipos de Laboratorio',
    slug: 'equipos-laboratorio',
    desc: 'Maquinaria de laboratorio óptico',
    Icon: Icons.Edger,
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)',
    accent: 'rgba(59,130,246,0.12)',
    count: 34,
    size: 'lg' as const,
    featuredSku: 'AO-ALE1600G',
  },
  {
    name: 'Mobiliario',
    slug: 'mobiliario',
    desc: 'Unidades y sillas oftálmicas',
    Icon: Icons.Phoropter,
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #60a5fa 100%)',
    accent: 'rgba(96,165,250,0.12)',
    count: 12,
    size: 'sm' as const,
    featuredSku: 'AO-CT1000',
  },
  {
    name: 'Monitores y Optotipos',
    slug: 'monitores-optotipos',
    desc: 'Monitores LCD y proyectores',
    Icon: Icons.Eye,
    gradient: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 50%, #2563eb 100%)',
    accent: 'rgba(37,99,235,0.10)',
    count: 15,
    size: 'sm' as const,
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
    gsap.set(els, { opacity: 0, y: 30, scale: 0.97 });
    gsap.to(els, {
      scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={ref} className="py-16 md:py-28 bg-[var(--bg)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.2em]">Explorar</span>
            <h2 className="text-[32px] md:text-[42px] font-black text-[var(--text)] tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>Categorías</h2>
          </div>
          <Link href="/productos" className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold text-[var(--green)] uppercase tracking-[0.1em] hover:gap-3 transition-all">
            Ver Catálogo Completo <Icons.ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-4 auto-rows-[220px] md:auto-rows-[280px]">
          {categories.map((c, idx) => (
            <Link
              key={c.slug}
              href={`/productos?category=${c.slug}`}
              className={`cat-card group relative overflow-hidden cursor-pointer ${
                c.size === 'lg'
                  ? 'col-span-12 md:col-span-7 row-span-1 md:row-span-2'
                  : 'col-span-6 md:col-span-5 row-span-1'
              }`}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: c.gradient }} />

              {/* Floating accent orbs */}
              <div className="absolute w-[200px] h-[200px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700" style={{ background: c.accent, top: '10%', right: '-10%', filter: 'blur(60px)' }} />
              <div className="absolute w-[120px] h-[120px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{ background: c.accent, bottom: '20%', left: '10%', filter: 'blur(40px)' }} />

              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              {/* Product image overlay */}
              <div className="absolute right-0 bottom-0 w-[55%] h-full opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                <img
                  src={`/images/products/${c.featuredSku}.jpg`}
                  alt=""
                  className="w-full h-full object-contain object-right-bottom scale-110 group-hover:scale-125 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.18em]">{c.count} productos</span>
                  <div className="w-9 h-9 bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                    <Icons.ArrowRight size={13} className="text-white" />
                  </div>
                </div>

                <div>
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 rounded-md">
                    <c.Icon size={14} className="text-white" />
                  </div>
                  <h3 className="text-[18px] md:text-[22px] font-bold text-white mb-1 leading-tight">{c.name}</h3>
                  <p className="text-[12px] text-white/60 max-w-[260px]">{c.desc}</p>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/20 group-hover:bg-white/40 transition-colors duration-500" />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/productos" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--green)] uppercase tracking-[0.08em]">
            Ver Todas las Categorías <Icons.ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
