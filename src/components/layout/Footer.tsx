'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const shopLinks = [
  { label: 'Todos los Productos', href: '/productos' },
  { label: 'Equipo Optométrico', href: '/productos?category=equipamiento-optometrico' },
  { label: 'Instrumentos Oftálmicos', href: '/productos?category=instrumentos-oftalmicos' },
  { label: 'Equipo de Laboratorio', href: '/productos?category=equipo-de-laboratorio' },
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

  return (
    <footer ref={ref} className="bg-[var(--bg-warm)] border-t border-[var(--border-light)]">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="footer-col">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[var(--green)] flex items-center justify-center rounded-lg">
                <Icons.Eye size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold text-[var(--text)] tracking-[0.02em] leading-none">ATLANTIC</span>
                <span className="text-[7px] font-semibold tracking-[0.35em] text-[var(--green)] uppercase leading-none mt-[2px]">OPTICAL</span>
              </div>
            </Link>
            <p className="text-[13px] text-[var(--text-muted)] leading-[1.65] max-w-[260px]">
              Tu proveedor de confianza en equipo oftálmico y optométrico profesional. Envío directo a México.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[var(--text)] uppercase tracking-[0.14em] mb-4">Tienda</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--green)] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[var(--text)] uppercase tracking-[0.14em] mb-4">Ayuda</h4>
            <ul className="space-y-2.5">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--green)] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[var(--text)] uppercase tracking-[0.14em] mb-4">Empresa</h4>
            <ul className="space-y-2.5 mb-4">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--green)] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-2.5">
              {social.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="w-8 h-8 bg-[var(--text)] flex items-center justify-center rounded-full hover:bg-[var(--green)] transition-colors">
                  <s.icon size={13} className="text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-light)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[var(--text-soft)]">
              &copy; 2026 Atlantic Optical. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Icons.CreditCard size={16} className="text-[var(--text-soft)]" />
              <Icons.Truck size={16} className="text-[var(--text-soft)]" />
              <Icons.ShieldCheck size={16} className="text-[var(--text-soft)]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
