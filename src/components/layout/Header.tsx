'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const allProducts = productsData as Array<{
  sku: string; name: string; slug: string; category: string; category_slug: string;
  subcategory: string; subcategory_slug: string; image: string;
}>;

const navItems = [
  {
    label: 'Equipos Oftálmicos',
    href: '/productos?category=equipos-oftalmologia-optica',
    mega: {
      type: 'products' as const,
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
      get products() {
        return allProducts.filter(p => p.category_slug === 'equipos-oftalmologia-optica').slice(0, 6);
      },
    },
  },
  {
    label: 'Instrumentos',
    href: '/productos?subcategory=monturas-de-prueba',
    mega: {
      type: 'products' as const,
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
      get products() {
        return allProducts.filter(p =>
          ['monturas-de-prueba', 'cajas-de-prisma', 'lente-de-aumento', 'lente-de-3-espejos'].includes(p.subcategory_slug)
        ).slice(0, 6);
      },
    },
  },
  {
    label: 'Laboratorio',
    href: '/productos?category=equipos-laboratorio',
    mega: {
      type: 'products' as const,
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
      get products() {
        return allProducts.filter(p => p.category_slug === 'equipos-laboratorio').slice(0, 6);
      },
    },
  },
  {
    label: 'Mobiliario',
    href: '/productos?category=mobiliario',
    mega: {
      type: 'products' as const,
      categories: [
        { name: 'Sillas con Pedal', slug: 'sillas-con-pedal' },
        { name: 'Sillas para Óptica', slug: 'sillas-para-optica' },
        { name: 'Mesas de Elevación', slug: 'mesas-de-elevacion' },
        { name: 'Mesas Dobles', slug: 'mesas-dobles' },
        { name: 'Mesas Multifuncional', slug: 'mesas-multifuncional' },
      ],
      get products() {
        return allProducts.filter(p => p.category_slug === 'mobiliario').slice(0, 6);
      },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const headerRef = useRef<HTMLElement>(null);
  const megaTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      backgroundColor: scrolled ? 'rgba(15,35,64,0.97)' : 'rgba(15,35,64,0.55)',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      duration: 0.28,
    });
  }, [scrolled]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const term = searchQuery.toLowerCase();
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.subcategory.toLowerCase().includes(term)
    ).slice(0, 8);
    setSearchResults(results);
  }, [searchQuery]);

  const openMega = useCallback((label: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setActiveMega(label);
    const allItems = [...navItems, ...rightNavItems];
    const item = allItems.find(n => n.label === label);
    if (item?.mega?.type === 'products' && item.mega.categories.length > 0) {
      setActiveCat(item.mega.categories[0].slug);
    } else {
      setActiveCat(null);
    }
  }, []);

  const closeMega = useCallback(() => {
    megaTimerRef.current = setTimeout(() => {
      setActiveMega(null);
      setActiveCat(null);
    }, 150);
  }, []);

  const keepMegaOpen = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
  }, []);

  const allNavItems = [...navItems, ...rightNavItems];

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 flex items-center justify-between h-[60px]">
          <button className="lg:hidden w-11 h-11 flex items-center justify-center -ml-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <Icons.X size={22} className="text-white" /> : <Icons.Menu size={22} className="text-white" />}
          </button>

          <Link href="/" className="flex items-center gap-0 shrink-0">
            <img
              src="/images/logo-atlantic.png"
              alt="Atlantic Optical Internacional"
              className="h-[40px] w-auto object-contain"
            />
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-11 h-11 flex items-center justify-center text-white hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Buscar"
            >
              <Icons.Search size={18} />
            </button>
            <Link href="/admin" className="w-11 h-11 flex items-center justify-center text-white hover:text-white transition-colors hidden sm:flex rounded-lg hover:bg-white/10">
              <Icons.User size={18} />
            </Link>
            <Link href="/carrito" className="w-11 h-11 flex items-center justify-center text-white hover:text-white transition-colors relative rounded-lg hover:bg-white/10">
              <Icons.ShoppingCart size={18} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--blue)] text-[8px] font-bold text-white rounded-full flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute top-[60px] left-0 right-0 bg-[#0f2340] border-b border-white/10 shadow-2xl z-50">
            <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-4">
              <div className="relative max-w-2xl mx-auto">
                <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos por nombre, SKU o categoría..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-[var(--blue)] transition-colors"
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <Icons.X size={18} />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="max-w-2xl mx-auto mt-3 border border-white/10 bg-[#0a1628] shadow-2xl max-h-[400px] overflow-y-auto">
                  {searchResults.map(p => (
                    <Link
                      key={p.sku}
                      href={`/productos/${p.slug}/`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-12 h-12 bg-white/5 flex-shrink-0 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-white truncate">{p.name}</div>
                        <div className="text-[11px] text-white/40">{p.sku} · {p.subcategory}</div>
                      </div>
                      <Icons.ArrowRight size={14} className="text-white/30 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="max-w-2xl mx-auto mt-3 p-6 text-center text-white/40 text-[14px]">
                  No se encontraron productos para &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop Navigation Row */}
        <nav className="hidden lg:block border-t border-white/10">
          <div className="max-w-[1680px] mx-auto px-6 md:px-10 flex items-center h-[46px]">
            <div className="flex items-center gap-0 flex-1">
              {[...navItems, ...rightNavItems].map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openMega(item.label)}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors text-white ${
                      activeMega === item.label ? 'bg-white/10' : 'hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                    <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${activeMega === item.label ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Mega Menu Panels */}
        {allNavItems.map((item) => (
          <div
            key={item.label}
            className={`hidden lg:block absolute top-full left-0 right-0 bg-[#0f2340] border-t border-white/10 shadow-2xl transition-all duration-300 ${
              activeMega === item.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
            onMouseEnter={keepMegaOpen}
            onMouseLeave={closeMega}
          >
            <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
              {item.mega.type === 'products' && (
                <div className="flex gap-10">
                  <div className="w-[240px] flex-shrink-0">
                    <h4 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-4">Categorías</h4>
                    <div className="space-y-1">
                      {item.mega.categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/productos?subcategory=${cat.slug}`}
                          className={`block px-3 py-2 text-[13px] transition-colors ${
                            activeCat === cat.slug
                              ? 'bg-[var(--blue)] text-white font-medium'
                              : 'text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                          onClick={() => setActiveCat(cat.slug)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={item.href}
                      className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-[#60a5fa] uppercase tracking-[0.08em] hover:gap-2.5 transition-all"
                    >
                      Ver Todo <Icons.ArrowRight size={11} />
                    </Link>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-4">Productos Destacados</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {item.mega.products.map((p) => (
                        <Link
                          key={p.sku}
                          href={`/productos/${p.slug}/`}
                          className="group flex items-center gap-3 p-3 hover:bg-white/10 transition-colors"
                        >
                          <div className="w-14 h-14 bg-white/5 flex-shrink-0 overflow-hidden border border-white/10">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-white truncate group-hover:text-[#60a5fa] transition-colors">{p.name}</div>
                            <div className="text-[10px] text-white/40 truncate">{p.subcategory}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {item.mega.type === 'links' && (
                <div className="flex gap-12">
                  {item.mega.columns.map((col) => (
                    <div key={col.title}>
                      <h4 className="text-[11px] font-bold text-white/70 uppercase tracking-[0.12em] mb-4">{col.title}</h4>
                      <div className="space-y-2.5">
                        {col.links.map((link) => (
                          <Link key={link.label} href={link.href} className="block text-[13px] text-white/60 hover:text-white transition-colors">
                            {link.label}
                          </Link>
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 w-[300px] max-w-[85vw] h-full bg-[#0f2340] overflow-y-auto shadow-2xl">
            <div className="pt-[72px] px-5 pb-6">
              <div className="mb-6">
                <img
                  src="/images/logo-atlantic.png"
                  alt="Atlantic Optical Internacional"
                  className="h-[36px] w-auto object-contain brightness-0 invert"
                />
              </div>

              <div className="relative mb-6">
                <Icons.Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-white/10 border border-white/20 text-[14px] text-white placeholder-white/40 focus:outline-none focus:border-[var(--blue)]"
                />
              </div>

              {[...navItems, ...rightNavItems].map((item) => (
                <div key={item.label} className="border-b border-white/10">
                  <Link href={item.href} className="block py-3.5 min-h-[44px] flex items-center text-[14px] font-bold text-white" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-white/10">
                <Link href="/contacto" className="block py-3 min-h-[44px] flex items-center text-[14px] text-white/60 hover:text-white" onClick={() => setMobileOpen(false)}>Contacto</Link>
                <Link href="/faq" className="block py-3 min-h-[44px] flex items-center text-[14px] text-white/60 hover:text-white" onClick={() => setMobileOpen(false)}>Preguntas Frecuentes</Link>
                <Link href="/admin" className="block py-3 min-h-[44px] flex items-center text-[14px] text-white/60 hover:text-white" onClick={() => setMobileOpen(false)}>Panel Admin</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
