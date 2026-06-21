'use client';

import Link from 'next/link';
import Icons from '@/components/ui/Icons';

const categories = [
  { name: 'Equipos de Oftalmología y Óptica', slug: 'equipos-oftalmologia-optica', desc: 'Instrumentos de diagnóstico oftálmico', Icon: Icons.EyeRefractometer, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', count: 72, size: 'lg' as const },
  { name: 'Equipos de Laboratorio', slug: 'equipos-laboratorio', desc: 'Maquinaria para laboratorio óptico', Icon: Icons.Edger, img: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=600&q=80', count: 33, size: 'lg' as const },
  { name: 'Mobiliario', slug: 'mobiliario', desc: 'Unidades y sillas oftálmicas', Icon: Icons.Phoropter, img: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600&q=80', count: 32, size: 'sm' as const },
  { name: 'Monitores y Optotipos', slug: 'monitores-optotipos', desc: 'Monitores LCD y proyectores', Icon: Icons.Eye, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', count: 17, size: 'sm' as const },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-[var(--bg)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="wow-fadeUp">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[10px] font-semibold text-[var(--green)] uppercase tracking-[0.18em]">Explorar</span>
              <h2 className="text-[28px] md:text-[38px] font-black text-[var(--text)] tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>Categorías</h2>
            </div>
            <Link href="/productos" className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--green)] uppercase tracking-[0.08em] hover:gap-2.5 transition-all">
              View All <Icons.ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
          {categories.map((c, idx) => (
            <Link key={c.slug} href={`/productos?category=${c.slug}`} className={`wow-fadeUp group relative overflow-hidden cursor-pointer ${
              c.size === 'lg' ? 'col-span-12 md:col-span-7 row-span-1 md:row-span-2' :
              'col-span-6 md:col-span-5 row-span-1'
            }`}
            style={{ transitionDelay: `${0.08 * idx}s` }}
            >
              <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-[0.16em]">{c.count} productos</span>
                  <div className="w-8 h-8 bg-white/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.ArrowRight size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="w-6 h-6 bg-white/10 backdrop-blur flex items-center justify-center mb-2 rounded-sm">
                    <c.Icon size={12} className="text-white" />
                  </div>
                  <h3 className="text-[16px] font-bold text-white mb-0.5">{c.name}</h3>
                  <p className="text-[12px] text-white/60">{c.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/productos" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--green)] uppercase tracking-[0.08em]">
            View All Categories <Icons.ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
