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
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        gsap.fromTo(el.querySelectorAll<HTMLElement>('.footer-col'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer ref={ref} className="bg-white/40 backdrop-blur-[60px] border-t border-white/40 relative overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-20 relative z-10">
        <div className="footer-col mb-14 p-8 md:p-10 glass-card">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-[20px] font-bold text-[var(--text)] mb-1">Mantente Actualizado</h3>
              <p className="text-[14px] text-[var(--text-muted)]">Recibe ofertas, nuevos productos y noticias de Atlantic Optical.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <Icons.CheckCircle size={18} />
                <span className="text-[14px] font-medium">¡Suscrito! Gracias.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input type="email" placeholder="tu@email.com" required value={email} onChange={e => setEmail(e.target.value)}
                  className="flex-1 md:w-[300px] px-5 py-3.5 min-h-[48px] bg-white/50 backdrop-blur-sm border border-white/40 text-[var(--text)] text-[14px] placeholder-[var(--text-soft)] focus:outline-none focus:border-[var(--blue)] transition-colors" />
                <button type="submit" className="px-8 py-3 bg-[var(--blue)] text-white text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[var(--blue-hover)] transition-colors whitespace-nowrap">
                  Suscribir
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          <div className="footer-col lg:col-span-2">
            <Link href="/" className="block mb-6">
              <img src="/images/logo-dark.png" alt="Atlantic Optical Internacional" width={320} height={180}
                className="h-[70px] md:h-[80px] w-auto object-contain" />
            </Link>
            <p className="text-[14px] text-[var(--text-muted)] leading-[1.7] max-w-[320px] mb-6">
              Empresa dedicada a la comercialización internacional de productos ópticos generales y marcas propias. Envío directo desde China a toda Latinoamérica.
            </p>
            <div className="flex gap-3">
              {social.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-11 h-11 bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-[var(--blue)] hover:border-[var(--blue)] transition-all duration-300">
                  <s.icon size={16} className="text-[var(--text-muted)]" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.16em] mb-6">Tienda</h4>
            <ul className="space-y-3.5">
              {shopLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.16em] mb-6">Ayuda</h4>
            <ul className="space-y-3.5">
              {helpLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-[0.16em] mb-6">Empresa</h4>
            <ul className="space-y-3.5">
              {companyLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-light)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[var(--text-soft)]">&copy; 2026 Atlantic Optical Internacional S.A. Todos los derechos reservados.</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {[
                { icon: Icons.CreditCard, label: 'Pago Seguro' },
                { icon: Icons.Truck, label: 'Envío Internacional' },
                { icon: Icons.ShieldCheck, label: 'Garantía 12 Meses' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[var(--text-soft)]">
                  <item.icon size={14} />
                  <span className="text-[11px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
