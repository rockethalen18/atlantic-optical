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
  { icon: Icons.Facebook, href: 'https://www.facebook.com/profile.php?id=61590555098794', label: 'Facebook' },
  { icon: Icons.Instagram, href: 'https://www.instagram.com/atlanticoptical', label: 'Instagram' },
  { icon: Icons.Linkedin, href: 'https://www.linkedin.com/company/atlantic-optical', label: 'LinkedIn' },
  { icon: Icons.Youtube, href: 'https://www.youtube.com/@atlanticoptical', label: 'YouTube' },
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
    <footer ref={ref} className="bg-[#f8f5f0] relative overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-16 relative z-10">
        {/* Newsletter Bar */}
        <div className="footer-col mb-12 p-8 bg-white border border-[#e8e4de]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-1">Mantente Actualizado</h3>
              <p className="text-[13px] text-[#6e6e73]">Recibe ofertas, nuevos productos y noticias de Atlantic Optical.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#006633]">
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
                  className="flex-1 md:w-[280px] px-4 py-3.5 min-h-[48px] bg-[#f5f5f7] border border-[#e8e8e8] text-[#1d1d1f] text-[14px] placeholder-[#86868b] focus:outline-none focus:border-[#006633] transition-colors"
                />
                <button type="submit" className="px-6 py-3 bg-[#1d1d1f] text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[#2d2d2f] transition-colors whitespace-nowrap">
                  Suscribir
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="footer-col lg:col-span-2">
            <Link href="/" className="block mb-5">
              <img
                src="/images/logo-dark.png"
                alt="Atlantic Optical Internacional"
                className="h-[40px] w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-[#6e6e73] leading-[1.7] max-w-[300px] mb-5">
              Empresa dedicada a la comercialización internacional de productos ópticos generales y marcas propias. Envío directo desde China a toda Latinoamérica.
            </p>
            <div className="flex gap-3">
              {social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 bg-[#1d1d1f] flex items-center justify-center rounded-full hover:bg-[#006633] transition-colors">
                  <s.icon size={15} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-[0.14em] mb-5">Tienda</h4>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-[0.14em] mb-5">Ayuda</h4>
            <ul className="space-y-3">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[#1d1d1f] uppercase tracking-[0.14em] mb-5">Empresa</h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e8e4de]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[#86868b]">
              &copy; 2026 Atlantic Optical Internacional S.A. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-[#86868b]">
                <Icons.CreditCard size={14} />
                <span className="text-[11px]">Pago Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-[#86868b]">
                <Icons.Truck size={14} />
                <span className="text-[11px]">Envío Internacional</span>
              </div>
              <div className="flex items-center gap-2 text-[#86868b]">
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
