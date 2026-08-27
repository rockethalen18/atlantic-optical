'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';
import SearchOverlay from '@/components/ui/SearchOverlay';
import AuthModal from '@/components/ui/AuthModal';
import productsData from '../../../catalogos/products.json';

const allProducts = productsData as Array<{ name: string; slug: string; sku: string; category_slug: string; subcategory_slug: string; subcategory: string; }>;

const navItems = [
  {
    label: 'Equipos Oftálmicos',
    href: '/productos?category=equipos-oftalmologia-optica',
    mega: {
      type: 'products' as const,
      categorySlug: 'equipos-oftalmologia-optica',
      categories: [
        { name: 'Auto Refractómetros', slug: 'auto-refractometros-con-keratometro' },
        { name: 'Forópteros', slug: 'foropteros-manuales' },
        { name: 'Lámparas de Hendidura', slug: 'lamparas-de-hendidura' },
        { name: 'Tonómetros', slug: 'tonometros-de-contacto' },
        { name: 'Cámaras de Fondo', slug: 'camara-de-fondo' },
        { name: 'Oftalmoscopios', slug: 'oftalmoscopios' },
        { name: 'Retinoscopios', slug: 'retinoscopios' },
        { name: 'Pupilómetros', slug: 'pupilometros' },
        { name: 'OCT', slug: 'oct' },
      ],
    },
  },
  {
    label: 'Instrumentos',
    href: '/productos?subcategory=monturas-de-prueba',
    mega: {
      type: 'products' as const,
      categorySlug: '',
      categorySlugs: ['monturas-de-prueba', 'cajas-de-prisma', 'lente-de-aumento', 'lente-de-3-espejos', 'equipos-de-fisioterapia', 'microscopio-quirurgico', 'facoemulsificador'],
      categories: [
        { name: 'Lentes de Aumento', slug: 'lente-de-aumento' },
        { name: 'Lente de 3 Espejos', slug: 'lente-de-3-espejos' },
        { name: 'Monturas de Prueba', slug: 'monturas-de-prueba' },
        { name: 'Cajas de Prisma', slug: 'cajas-de-prisma' },
        { name: 'Cajas de Prueba', slug: 'cajas-de-prueba' },
        { name: 'Fisioterapia Visual', slug: 'equipos-de-fisioterapia' },
        { name: 'Microscopio Quirúrgico', slug: 'microscopio-quirurgico' },
        { name: 'Facoemulsificador', slug: 'facoemulsificador' },
      ],
    },
  },
  {
    label: 'Laboratorio',
    href: '/productos?category=equipos-laboratorio',
    mega: {
      type: 'products' as const,
      categorySlug: 'equipos-laboratorio',
      categories: [
        { name: 'Biseladoras Automáticas', slug: 'biseladoras-automaticas' },
        { name: 'Biseladoras Manuales', slug: 'biseladoras-manuales' },
        { name: 'Pulidoras', slug: 'pulidoras-manuales' },
        { name: 'Limpiadores Ultrasónicos', slug: 'limpiadores-ultrasonicos' },
        { name: 'Ranuradoras', slug: 'ranuradoras-manuales' },
        { name: 'Perforadoras', slug: 'perforadoras-al-aire' },
        { name: 'Tinturadoras', slug: 'tinturadoras' },
        { name: 'Esferómetros', slug: 'esferometros' },
      ],
    },
  },
  {
    label: 'Mobiliario',
    href: '/productos?category=mobiliario',
    mega: {
      type: 'products' as const,
      categorySlug: 'mobiliario',
      categories: [
        { name: 'Sillas con Pedal', slug: 'sillas-con-pedal' },
        { name: 'Sillas para Óptica', slug: 'sillas-para-optica' },
        { name: 'Mesas de Elevación', slug: 'mesas-de-elevacion' },
        { name: 'Mesas Dobles', slug: 'mesas-dobles' },
        { name: 'Mesas Multifuncional', slug: 'mesas-multifuncional' },
      ],
    },
  },
];

const rightNavItems = [
  {
    label: 'Monitores y Optotipos',
    href: '/productos?category=monitores-optotipos',
    mega: {
      type: 'links' as const,
      columns: [
        {
          title: 'Monitores LCD',
          links: [
            { label: 'Monitor LCD 23.8"', href: '/productos?subcategory=monitores-estandar' },
            { label: 'Monitor LCD Vertical', href: '/productos?subcategory=monitores-verticales' },
            { label: 'Monitor Visual 44 Test', href: '/productos?subcategory=monitores-estandar' },
          ],
        },
        {
          title: 'Proyectores y Optotipos',
          links: [
            { label: 'Proyectores Gráficos', href: '/productos?subcategory=proyectores-graficos' },
            { label: 'Optotipos Eléctricos', href: '/productos?subcategory=optotipos-electricos' },
            { label: 'Optotipos con Soporte', href: '/productos?subcategory=optotipos-con-soporte' },
            { label: 'Tablet LCD', href: '/productos?subcategory=tablet-lcd' },
            { label: 'Cartillas', href: '/productos?subcategory=cartillas' },
          ],
        },
      ],
    },
  },
  {
    label: 'Soporte',
    href: '/contacto',
    mega: {
      type: 'links' as const,
      columns: [
        {
          title: 'Atlantic Optical',
          links: [
            { label: 'Sobre Nosotros', href: '/nosotros' },
            { label: 'Programa Distribuidores', href: '/distribuidores' },
            { label: 'OEM & ODM', href: '/oem-odm' },
          ],
        },
        {
          title: 'Soporte',
          links: [
            { label: 'Seguimiento de Pedido', href: '/seguimiento' },
            { label: 'Garantía y Devoluciones', href: '/garantia' },
            { label: 'Preguntas Frecuentes', href: '/faq' },
            { label: 'Contáctanos', href: '/contacto' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Términos y Condiciones', href: '/terminos' },
          ],
        },
      ],
    },
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const megaTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      backgroundColor: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0)',
      boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.03)' : 'none',
      duration: 0.3,
    });
  }, [scrolled]);

  const openMega = useCallback((label: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setActiveMega(label);
    const all = [...navItems, ...rightNavItems];
    const item = all.find(n => n.label === label);
    if (item?.mega?.type === 'products' && item.mega.categories.length > 0) setActiveCat(item.mega.categories[0].slug);
    else setActiveCat(null);
  }, []);

  const closeMega = useCallback(() => {
    megaTimerRef.current = setTimeout(() => { setActiveMega(null); setActiveCat(null); }, 120);
  }, []);

  const keepMegaOpen = useCallback(() => { if (megaTimerRef.current) clearTimeout(megaTimerRef.current); }, []);

  const allNavItems = [...navItems, ...rightNavItems];

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(255,255,255,0)' }}>
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 flex items-center justify-between h-[80px] md:h-[90px]">
          <button className="lg:hidden w-12 h-12 flex items-center justify-center -ml-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <Icons.X size={24} className="text-[var(--text)]" /> : <Icons.Menu size={24} className="text-[var(--text)]" />}
          </button>

          <Link href="/" className="flex items-center gap-0 shrink-0">
            <img src="/images/logos/logo-horizontal.png" alt="Atlantic Optical Internacional" width={400} height={220} loading="eager" fetchPriority="high"
              className="h-[55px] md:h-[64px] w-auto object-contain" />
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-black/5"
              aria-label="Buscar">
              <Icons.Search size={20} />
            </button>
            <button
              onClick={() => setAuthOpen(true)}
              className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-black/5"
              aria-label="Mi cuenta"
            >
              <Icons.User size={20} />
            </button>
            <Link href="/carrito" className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors relative rounded-lg hover:bg-black/5">
              <Icons.ShoppingCart size={20} />
              <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-[var(--blue)] text-[9px] font-bold text-white rounded-full flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>

        <nav className="hidden lg:block border-t border-[var(--border-light)]" style={{ backgroundColor: scrolled ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0)' }}>
          <div className="max-w-[1680px] mx-auto px-6 md:px-10 flex items-center h-[48px]">
            <div className="flex items-center gap-0 flex-1">
              {allNavItems.map((item) => (
                <div key={item.label} className="relative" onMouseEnter={() => openMega(item.label)} onMouseLeave={closeMega}>
                  <Link href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition-all duration-200 ${activeMega === item.label ? 'text-[var(--blue)] bg-[var(--blue)]/5' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-black/[0.03]'}`}>
                    {item.label}
                    <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${activeMega === item.label ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {allNavItems.map((item) => (
          <div key={item.label}
            className={`hidden lg:block absolute top-full left-0 right-0 border-b border-[var(--border-light)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-200 ${activeMega === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}
            style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(40px)' }}
            onMouseEnter={keepMegaOpen} onMouseLeave={closeMega}>
            <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
              {item.mega.type === 'products' && (
                <div className="flex gap-10">
                  <div className="w-[240px] flex-shrink-0">
                    <h4 className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.12em] mb-4">Categorías</h4>
                    <div className="space-y-0.5">
                      {item.mega.categories.map((cat) => (
                        <div key={cat.slug}
                          className={`block px-3 py-2.5 text-[13px] rounded-lg transition-all duration-200 cursor-pointer ${activeCat === cat.slug ? 'bg-[var(--blue)] text-white font-medium shadow-md shadow-[var(--blue)]/20' : 'text-[var(--text-muted)] hover:bg-[var(--blue-light)]/60 hover:text-[var(--text)] hover:pl-4'}`}
                          onMouseEnter={() => setActiveCat(cat.slug)}>
                          {cat.name}
                        </div>
                      ))}
                    </div>
                    <Link href={item.href} className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.08em] hover:gap-2.5 transition-all">
                      Ver Todo <Icons.ArrowRight size={11} />
                    </Link>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.12em] mb-4">Productos Destacados</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {(() => {
                        const mega = item.mega;
                        let filtered: typeof allProducts = [];
                        if (activeCat) {
                          filtered = allProducts.filter(p => p.subcategory_slug === activeCat).slice(0, 6);
                        } else if (mega.type === 'products') {
                          const m = mega as { type: 'products'; categorySlug?: string; categorySlugs?: string[] };
                          if (m.categorySlug) {
                            filtered = allProducts.filter(p => p.category_slug === m.categorySlug).slice(0, 6);
                          } else if (m.categorySlugs) {
                            filtered = allProducts.filter(p => m.categorySlugs!.includes(p.subcategory_slug)).slice(0, 6);
                          }
                        }
                        return filtered.map((p) => {
                          const imgSrc = `/images/extracted_images/AO-${p.name.replace(/[-+]/g, '')}.jpg`;
                          return (
                          <Link key={p.sku} href={`/productos/${p.slug}/`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--blue-light)]/40 transition-all duration-200">
                            <div className="w-10 h-10 bg-[var(--bg-alt)] flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border-light)] group-hover:border-[var(--blue)]/20 transition-colors">
                              <img src={imgSrc} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-bold text-[var(--text)] truncate group-hover:text-[var(--blue)] transition-colors">{p.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)] truncate">{p.subcategory}</div>
                            </div>
                          </Link>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}
              {item.mega.type === 'links' && (
                <div className="flex gap-12">
                  {item.mega.columns.map((col) => (
                    <div key={col.title}>
                      <h4 className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.12em] mb-4">{col.title}</h4>
                      <div className="space-y-1">
                        {col.links.map((link) => (
                          <Link key={link.label} href={link.href} className="block text-[13px] text-[var(--text-muted)] hover:text-[var(--blue)] hover:pl-2 transition-all duration-200 py-1">{link.label}</Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 w-[300px] max-w-[85vw] h-full bg-white/95 backdrop-blur-2xl overflow-y-auto shadow-[20px_0_60px_rgba(0,0,0,0.1)]">
            <div className="pt-[94px] px-5 pb-6">
              <div className="mb-6">
                <img src="/images/logos/logo-dark.png" alt="Atlantic Optical Internacional" width={240} height={300} className="h-[60px] w-auto object-contain" />
              </div>
              <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="w-full flex items-center gap-3 mb-6 px-4 py-3 min-h-[44px] bg-white/80 border border-[var(--border)] rounded-xl text-[14px] text-[var(--text-muted)] hover:border-[var(--blue)] transition-colors">
                <Icons.Search size={16} />
                <span>Buscar productos...</span>
              </button>
              {[...navItems, ...rightNavItems].map((item) => (
                <div key={item.label} className="border-b border-[var(--border-light)]">
                  <Link href={item.href} className="block py-3.5 min-h-[44px] flex items-center text-[14px] font-bold text-[var(--text)] hover:text-[var(--blue)] transition-colors" onClick={() => setMobileOpen(false)}>{item.label}</Link>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                <Link href="/contacto" className="block py-3 min-h-[44px] flex items-center text-[14px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" onClick={() => setMobileOpen(false)}>Contacto</Link>
                <Link href="/faq" className="block py-3 min-h-[44px] flex items-center text-[14px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" onClick={() => setMobileOpen(false)}>Preguntas Frecuentes</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
