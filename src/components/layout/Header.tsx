'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const navItems = [
  {
    label: 'Equipos Oftálmicos',
    href: '/productos?category=equipos-oftalmologia',
    mega: {
      type: 'products' as const,
      viewAllBg: '#006535',
      categories: [
        { name: 'Auto Refractómetros', slug: 'auto-refractometros', href: '/productos?category=auto-refractometros' },
        { name: 'Auto Refractómetros con Keratómetro', slug: 'auto-refractometros-keratometro', href: '/productos?category=auto-refractometros-keratometro' },
        { name: 'Tonómetros', slug: 'tonometros', href: '/productos?category=tonometros' },
        { name: 'Lámparas de Hendidura', slug: 'lamparas-de-hendidura', href: '/productos?category=lamparas-de-hendidura' },
        { name: 'Forópteros', slug: 'foropteros', href: '/productos?category=foropteros' },
        { name: 'Lentes de Prueba', slug: 'lentes-de-prueba', href: '/productos?category=lentes-de-prueba' },
        { name: 'Equipos de Diagnóstico', slug: 'equipos-diagnostico', href: '/productos?category=equipos-diagnostico' },
        { name: 'Equipos Especiales', slug: 'equipos-especiales', href: '/productos?category=equipos-especiales' },
        { name: 'Accesorios Ópticos', slug: 'accesorios-opticos', href: '/productos?category=accesorios-opticos' },
      ],
      products: [
        { name: 'Auto Refractómetro ARK-7710', slug: 'ark-7710', sku: 'AO-ARK7710', cat: 'Auto Refractómetros con Keratómetro', img: '/images/products/AO-ARK7710.jpg' },
        { name: 'Foróptero Digital FP-800', slug: 'fp-800', sku: 'AO-FP800', cat: 'Forópteros Digitales', img: '/images/products/AO-FP800.jpg' },
        { name: 'Lámpara de Hendidura BL-66B', slug: 'bl-66b', sku: 'AO-BL66B', cat: 'Lámparas de Hendidura', img: '/images/products/AO-BL66B.jpg' },
        { name: 'Tonómetro SK-5500A', slug: 'sk-5500a', sku: 'AO-SK5500A', cat: 'Tonómetros', img: '/images/products/AO-SK5500A.jpg' },
        { name: 'Caja de Prueba 266 Lentes', slug: '266js', sku: 'AO-266JS', cat: 'Cajas de Prueba', img: '/images/products/AO-266JS.jpg' },
        { name: 'Cámara de Fondo RC-3100', slug: 'rc-3100', sku: 'AO-RC3100', cat: 'Cámara de Fondo', img: '/images/products/AO-RC3100.jpg' },
      ],
    },
  },
  {
    label: 'Instrumentos',
    href: '/productos?category=instrumentos',
    mega: {
      type: 'products' as const,
      viewAllBg: '#006535',
      categories: [
        { name: 'Oftalmoscopios', slug: 'oftalmoscopios', href: '/productos?category=oftalmoscopios' },
        { name: 'Retinoscopios', slug: 'retinoscopios', href: '/productos?category=retinoscopios' },
        { name: 'Pupilómetros', slug: 'pupilometros', href: '/productos?category=pupilometros' },
        { name: 'Lentes de Aumento', slug: 'lentes-de-aumento', href: '/productos?category=lentes-de-aumento' },
        { name: 'Lente de 3 Espejos', slug: 'lente-3-espejos', href: '/productos?category=lente-3-espejos' },
        { name: 'Monturas de Prueba', slug: 'monturas-de-prueba', href: '/productos?category=monturas-de-prueba' },
        { name: 'Fisioterapia Visual', slug: 'fisioterapia-visual', href: '/productos?category=fisioterapia-visual' },
        { name: 'Cajas de Prisma', slug: 'cajas-de-prisma', href: '/productos?category=cajas-de-prisma' },
      ],
      products: [
        { name: 'Oftalmoscopio YZ-11', slug: 'yz-11', sku: 'AO-YZ11', cat: 'Oftalmoscopios', img: '/images/products/AO-YZ11.jpg' },
        { name: 'Retinoscopio YZ-24', slug: 'yz-24', sku: 'AO-YZ24', cat: 'Retinoscopios', img: '/images/products/AO-YZ24.jpg' },
        { name: 'Pupilómetro Digital LY-9C', slug: 'ly-9c', sku: 'AO-LY9C', cat: 'Pupilómetros', img: '/images/products/AO-LY9C.jpg' },
        { name: 'Montura de Prueba TTF-08', slug: 'ttf-08', sku: 'AO-TTF08', cat: 'Monturas de Prueba', img: '/images/products/AO-TTF08.jpg' },
        { name: 'Caja de Prisma PS-22', slug: 'ps-22', sku: 'AO-PS22', cat: 'Cajas de Prisma', img: '/images/products/AO-PS22.jpg' },
        { name: 'Fisioterapia Visual KJR-D-A3', slug: 'kjr-d-a3', sku: 'AO-KJRDA3', cat: 'Fisioterapia Visual', img: '/images/products/AO-KJRDA3.jpg' },
      ],
    },
  },
  {
    label: 'Laboratorio',
    href: '/productos?category=equipos-laboratorio',
    mega: {
      type: 'products' as const,
      viewAllBg: '#006535',
      categories: [
        { name: 'Biseladoras', slug: 'biseladoras', href: '/productos?category=biseladoras' },
        { name: 'Pulidoras', slug: 'pulidoras', href: '/productos?category=pulidoras' },
        { name: 'Ranuradoras', slug: 'ranuradoras', href: '/productos?category=ranuradoras' },
        { name: 'Perforadoras', slug: 'perforadoras', href: '/productos?category=perforadoras' },
        { name: 'Limpiadores Ultrasónicos', slug: 'limpiadores', href: '/productos?category=limpiadores' },
        { name: 'Tinturadoras', slug: 'tinturadoras', href: '/productos?category=tinturadoras' },
        { name: 'Medición', slug: 'medicion', href: '/productos?category=medicion' },
      ],
      products: [
        { name: 'Biseladora Automática ALE-1600G', slug: 'ale-1600g', sku: 'AO-ALE1600G', cat: 'Biseladoras Automáticas', img: '/images/products/AO-ALE1600G.jpg' },
        { name: 'Biseladora Semiautomática SJG-7100', slug: 'sjg-7100', sku: 'AO-SJG7100', cat: 'Biseladoras Semiautomáticas', img: '/images/products/AO-SJG7100.jpg' },
        { name: 'Pulidora Semiautomática LY-900', slug: 'ly-900', sku: 'AO-LY900', cat: 'Pulidoras', img: '/images/products/AO-LY900.jpg' },
        { name: 'Limpiador Ultrasónico GB-800', slug: 'gb-800', sku: 'AO-GB800', cat: 'Limpiadores Ultrasónicos', img: '/images/products/AO-GB800.jpg' },
        { name: 'Ranuradora Manual LY-12A', slug: 'ly-12a', sku: 'AO-LY12A', cat: 'Ranuradoras', img: '/images/products/AO-LY12A.jpg' },
        { name: 'Esferómetro TM-001', slug: 'tm-001', sku: 'AO-TM001', cat: 'Medición', img: '/images/products/AO-TM001.jpg' },
      ],
    },
  },
  {
    label: 'Mobiliario',
    href: '/productos?category=mobiliario',
    mega: {
      type: 'products' as const,
      viewAllBg: '#006535',
      categories: [
        { name: 'Unidades Oftálmicas', slug: 'unidades-oftalmicas', href: '/productos?category=unidades-oftalmicas' },
        { name: 'Sillas', slug: 'sillas', href: '/productos?category=sillas' },
        { name: 'Mesas', slug: 'mesas', href: '/productos?category=mesas' },
        { name: 'Brazos de Pared', slug: 'brazos-de-pared', href: '/productos?category=brazos-de-pared' },
      ],
      products: [
        { name: 'Unidad Oftálmica CT-1000', slug: 'ct-1000', sku: 'AO-CT1000', cat: 'Automáticas', img: '/images/products/AO-CT1000.jpg' },
        { name: 'Unidad Oftálmica S-900B', slug: 's-900b', sku: 'AO-S900B', cat: 'Con Silla Reclinable', img: '/images/products/AO-S900B.jpg' },
        { name: 'Unidad Oftálmica CS-518', slug: 'cs-518', sku: 'AO-CS518', cat: 'Con Silla Elevación', img: '/images/products/AO-CS518.jpg' },
        { name: 'Silla con Pedal WZ-DT-1A', slug: 'wz-dt-1a', sku: 'AO-WZDT1A', cat: 'Sillas con Pedal', img: '/images/products/AO-WZDT1A.jpg' },
        { name: 'Mesa de Elevación WZ-3A', slug: 'wz-3a', sku: 'AO-WZ3A', cat: 'Mesas de Elevación', img: '/images/products/AO-WZ3A.jpg' },
        { name: 'Brazo de Pared WZ-ZN', slug: 'wz-zn', sku: 'AO-WZZN', cat: 'Brazos de Pared', img: '/images/products/AO-WZZN.jpg' },
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
            { label: 'Monitor LCD 23.8" SC-800', href: '/productos?category=monitores-lcd' },
            { label: 'Monitor LCD 21.5" K215F', href: '/productos?category=monitores-lcd' },
            { label: 'Monitor LCD 23" 215D', href: '/productos?category=monitores-lcd' },
            { label: 'Monitor LCD Vertical CTS-215', href: '/productos?category=monitores-lcd' },
            { label: 'Monitor Visual 44 Test ACP-300', href: '/productos?category=monitores-lcd' },
          ],
        },
        {
          title: 'Proyectores y Optotipos',
          links: [
            { label: 'Proyector Gráfico WB-1117A', href: '/productos?category=proyectores' },
            { label: 'Proyector Gráfico WZ-3000B', href: '/productos?category=proyectores' },
            { label: 'Optotipo Tablet LCD WB-1112H', href: '/productos?category=optotipos' },
            { label: 'Cartilla Examen Visual WZ-08', href: '/productos?category=optotipos' },
            { label: 'Optotipo Eléctrico CB-028', href: '/productos?category=optotipos' },
          ],
        },
      ],
      promo: {
        title: 'Monitores LCD',
        subtitle: 'Pantallas de alta resolución para exámenes visuales',
        href: '/productos?category=monitores-optotipos',
        img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
      },
    },
  },
  {
    label: 'Soporte',
    href: '#',
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
  const headerRef = useRef<HTMLElement>(null);
  const megaTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0)',
      backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
      boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : 'none',
      duration: 0.28,
    });
  }, [scrolled]);

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
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menú">
            {mobileOpen ? <Icons.X size={20} className="text-[var(--text)]" /> : <Icons.Menu size={20} className="text-[var(--text)]" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--green)] flex items-center justify-center rounded-lg">
              <Icons.Eye size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-extrabold text-[var(--text)] tracking-[0.02em] leading-none">ATLANTIC</span>
              <span className="text-[7px] font-semibold tracking-[0.35em] text-[var(--green)] uppercase leading-none mt-[2px]">OPTICAL</span>
            </div>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <Link href="/admin" className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors hidden sm:flex rounded-lg hover:bg-black/5">
              <Icons.User size={18} />
            </Link>
            <Link href="/carrito" className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors relative rounded-lg hover:bg-black/5">
              <Icons.ShoppingCart size={18} />
              <span className="absolute top-[4px] right-[4px] w-3.5 h-3.5 bg-[var(--green)] text-[7px] font-bold text-white rounded-full flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Row */}
        <nav className="hidden lg:block border-t border-black/10">
          <div className="max-w-[1680px] mx-auto px-6 md:px-10 flex items-center h-[46px]">
            <div className="flex items-center gap-0 flex-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(item.label)}
                  onMouseLeave={closeMega}
                >
                  <Link href={item.href} className="px-4 h-full text-[14px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors flex items-center gap-1 relative" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.label}
                    <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${activeMega === item.label ? 'rotate-180' : ''}`} />
                    <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--green)] transition-all duration-400 ${activeMega === item.label ? 'scale-x-100' : 'scale-x-0'}`} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-0">
              {rightNavItems.map((item) => (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(item.label)}
                  onMouseLeave={closeMega}
                >
                  <button className="px-4 h-full text-[14px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors flex items-center gap-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.label}
                    <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${activeMega === item.label ? 'rotate-180' : ''}`} />
                    <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--green)] transition-all duration-400 ${activeMega === item.label ? 'scale-x-100' : 'scale-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Mega Menu Panels */}
        {allNavItems.map((item) => {
          if (!item.mega || activeMega !== item.label) return null;
          const mega = item.mega;

          if (mega.type === 'products') {
            const activeCatData = mega.categories.find(c => c.slug === activeCat) || mega.categories[0];
            return (
              <div
                key={item.label}
                className="hidden lg:block absolute top-full left-0 right-0 border-t border-black/10 bg-white z-50"
                onMouseEnter={keepMegaOpen}
                onMouseLeave={closeMega}
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
              >
                <div className="max-w-[1680px] mx-auto px-6 md:px-10 flex" style={{ minHeight: '420px' }}>
                  {/* Left: Category List */}
                  <div className="w-[260px] flex-shrink-0 flex flex-col justify-between py-6 border-r border-[var(--border-light)]">
                    <div>
                      {mega.categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onMouseEnter={() => setActiveCat(cat.slug)}
                          onClick={() => { closeMega(); window.location.href = cat.href; }}
                          className={`w-full text-left px-4 py-[10px] text-[14px] transition-colors ${activeCat === cat.slug ? 'bg-[var(--bg-alt)] font-bold text-[var(--text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-alt)] hover:text-[var(--text)]'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    <Link
                      href={item.href}
                      onClick={() => closeMega()}
                      className="block text-center py-3 text-white text-[13px] font-bold transition-colors"
                      style={{ background: mega.viewAllBg }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#01582c'}
                      onMouseLeave={(e) => e.currentTarget.style.background = mega.viewAllBg}
                    >
                      Ver Todo {item.label}
                    </Link>
                  </div>

                  {/* Right: Product Grid */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[14px] font-bold text-[var(--text)]">{activeCatData?.name}</span>
                      <Link href={activeCatData?.href || '#'} className="text-[12px] text-[var(--green)] font-semibold hover:underline">
                        Ver Todos &gt;&gt;
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {mega.products
                        .filter(p => {
                          if (!activeCat) return true;
                          const catSlug = activeCat;
                          return p.cat.toLowerCase().includes(catSlug.replace(/-/g, ''));
                        })
                        .slice(0, 6)
                        .map((p) => (
                        <Link key={p.sku} href={`/productos?category=${p.cat.toLowerCase().replace(/\s+/g, '-')}`} className="group flex gap-3 p-3 bg-[var(--bg-alt)] hover:bg-white hover:shadow-sm transition-all">
                          <div className="w-[100px] h-[100px] flex-shrink-0 bg-white flex items-center justify-center overflow-hidden">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] text-[var(--text-muted)] block mb-1">{p.cat}</span>
                            <h4 className="text-[13px] font-bold text-[var(--text)] group-hover:text-[var(--green)] transition-colors leading-tight line-clamp-2">{p.name}</h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (mega.type === 'links') {
            return (
              <div
                key={item.label}
                className="hidden lg:block absolute top-full right-0 bg-white border-t border-black/10 z-50"
                style={{ left: '50%', transform: 'translateX(-50%)', width: '100vw', maxWidth: '100vw', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                onMouseEnter={keepMegaOpen}
                onMouseLeave={closeMega}
              >
                <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
                  <div className="grid grid-cols-12 gap-6">
                    <div className={`col-span-${mega.promo ? '9' : '12'}`}>
                      <div className="grid grid-cols-3 gap-12">
                        {mega.columns.map((col) => (
                          <div key={col.title}>
                            <h4 className="text-[14px] text-[var(--text)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{col.title}</h4>
                            <ul className="space-y-3">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} onClick={() => closeMega()} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--green)] transition-colors">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    {mega.promo && (
                      <div className="col-span-3">
                        <Link href={mega.promo.href} onClick={() => closeMega()} className="group block overflow-hidden">
                          <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-alt)]">
                            <img src={mega.promo.img} alt={mega.promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="pt-3">
                            <h5 className="text-[14px] font-bold text-[var(--text)] group-hover:text-[var(--green)] transition-colors">{mega.promo.title}</h5>
                            <p className="text-[12px] text-[var(--text-muted)]">{mega.promo.subtitle}</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </header>

      <div className="h-[106px] lg:h-[106px]" />

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[300px] bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.12em]">Menú</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                  <Icons.X size={18} className="text-[var(--text)]" />
                </button>
              </div>
              {[...navItems, ...rightNavItems].map((item) => (
                <div key={item.label} className="mb-4">
                  <Link href={item.href} className="block py-2 text-[14px] font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.label}
                  </Link>
                  {item.mega?.type === 'products' && (
                    <div className="pl-3 space-y-1">
                      {item.mega.categories.map((cat) => (
                        <Link key={cat.slug} href={cat.href} className="block py-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--green)] transition-colors" onClick={() => setMobileOpen(false)}>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {item.mega?.type === 'links' && (
                    <div className="pl-3 space-y-1">
                      {item.mega.columns.map((col) => (
                        <div key={col.title}>
                          <span className="block py-1 text-[11px] font-semibold text-[var(--text-soft)] uppercase tracking-wider">{col.title}</span>
                          {col.links.map((link) => (
                            <Link key={link.label} href={link.href} className="block py-1 text-[13px] text-[var(--text-muted)] hover:text-[var(--green)] transition-colors" onClick={() => setMobileOpen(false)}>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <Link href="/admin" className="block py-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] font-medium" onClick={() => setMobileOpen(false)}>Panel de Administración</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
