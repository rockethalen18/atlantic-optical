'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const shopLinks = [
  { label: 'Todos los Productos', href: '/productos' },
  { label: 'Equipos Oftálmicos', href: '/productos?category=equipos-oftalmologia-optica' },
  { label: 'Equipos de Laboratorio', href: '/productos?category=equipos-laboratorio' },
  { label: 'Mobiliario', href: '/productos?category=mobiliario' },
  { label: 'Monitores y Optotipos', href: '/productos?category=monitores-optotipos' },
];

const helpLinks = [
  { label: 'Seguimiento de Pedido', href: '/seguimiento' },
  { label: 'Garantía y Devoluciones', href: '/garantia' },
  { label: 'Preguntas Frecuentes', href: '/faq' },
  { label: 'Contáctanos', href: '/contacto' },
];

const companyLinks = [
  { label: 'Sobre Nosotros', href: '/nosotros' },
  { label: 'Programa Distribuidores', href: '/distribuidores' },
  { label: 'OEM & ODM', href: '/oem-odm' },
  { label: 'Términos y Condiciones', href: '/terminos' },
];

const social = [
  { icon: Icons.Facebook, href: '#', label: 'Facebook' },
  { icon: Icons.Instagram, href: '#', label: 'Instagram' },
  { icon: Icons.Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Icons.Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gsap.fromTo(el.querySelectorAll<HTMLElement>('.footer-col'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer ref={ref} className="bg-[var(--text)] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-16 relative z-10">
        {/* Newsletter Bar */}
        <div className="footer-col mb-12 p-8 bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-white mb-1">Mantente Actualizado</h3>
              <p className="text-[13px] text-white/50">Recibe ofertas, nuevos productos y noticias de Atlantic Optical.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[var(--green-status)]">
                <Icons.CheckCircle size={18} />
                <span className="text-[14px] font-medium">¡Suscrito! Gracias.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 md:w-[280px] px-4 py-3 bg-white/10 border border-white/20 text-white text-[14px] placeholder-white/40 focus:outline-none focus:border-[var(--green-status)] transition-colors"
                />
                <button type="submit" className="px-6 py-3 bg-[var(--green)] text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[var(--green-hover)] transition-colors whitespace-nowrap">
                  Suscribir
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="footer-col lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-[var(--green)] flex items-center justify-center rounded-lg">
                <Icons.Eye size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-white tracking-[0.02em] leading-none">ATLANTIC</span>
                <span className="text-[7px] font-semibold tracking-[0.35em] text-[var(--green-status)] uppercase leading-none mt-[2px]">OPTICAL</span>
              </div>
            </Link>
            <p className="text-[13px] text-white/50 leading-[1.7] max-w-[300px] mb-5">
              Tu proveedor de confianza en equipo oftálmico y optométrico profesional. Envío directo desde China a México con costos transparentes.
            </p>
            <div className="flex gap-2.5">
              {social.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="w-9 h-9 bg-white/10 flex items-center justify-center rounded-full hover:bg-[var(--green)] transition-colors">
                  <s.icon size={14} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.14em] mb-5">Tienda</h4>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.14em] mb-5">Ayuda</h4>
            <ul className="space-y-3">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.14em] mb-5">Empresa</h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/30">
              &copy; 2026 Atlantic Optical. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/30">
                <Icons.CreditCard size={14} />
                <span className="text-[11px]">Pago Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-white/30">
                <Icons.Truck size={14} />
                <span className="text-[11px]">Envío Internacional</span>
              </div>
              <div className="flex items-center gap-2 text-white/30">
                <Icons.ShieldCheck size={14} />
                <span className="text-[11px]">Garantía 12 Meses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
