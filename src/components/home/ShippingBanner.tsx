'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

const iconMap: Record<string, typeof Icons.Shipping> = {
  maritimo: Icons.Shipping,
  aereo: Icons.Truck,
  express: Icons.Package,
  standard: Icons.Shipping,
};

const colorMap: Record<string, string> = {
  maritimo: 'var(--blue)',
  aereo: 'var(--amber)',
  express: '#60a5fa',
  standard: 'var(--blue)',
};

const fallbackMethods = [
  { method: 'maritimo', method_label: 'Marítimo', cost_per_kg: 4.50, min_days: 30, max_days: 45, description: 'Ideal para equipos grandes y pesados. Opción más económica.' },
  { method: 'aereo', method_label: 'Aéreo', cost_per_kg: 12.00, min_days: 7, max_days: 15, description: 'Equilibrio entre velocidad y costo. Para pedidos medianos.' },
  { method: 'express', method_label: 'Express', cost_per_kg: 20.00, min_days: 3, max_days: 7, description: 'Máxima urgencia. Para equipos críticos y repuestos.' },
];

function AnimatedNumber({ target, decimals = 2 }: { target: number; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        const start = performance.now();
        const dur = 2200;
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          setVal(ease * target);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{val.toFixed(decimals)}</span>;
}

export default function ShippingBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [methods, setMethods] = useState(fallbackMethods);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch(`${API_BASE}/shipping`)
      .then(r => r.json())
      .then(data => {
        if (data?.data?.rates && data.data.rates.length > 0) {
          setMethods(data.data.rates);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.ship-card');
    gsap.set(els, { opacity: 0, y: 30, scale: 0.97 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, scale: 1,
      duration: 0.6, stagger: 0.12, ease: 'power3.out',
    });
  }, [mounted, methods]);

  return (
    <section ref={sectionRef} className="py-16 md:py-28 relative overflow-hidden text-white" style={{ background: 'var(--dark-bg, #0a1628)' }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.05] rounded-full blur-[120px]" style={{ background: '#1e3a5f' }} />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#2563eb' }}>Envío Directo</span>
          <h2 className="text-[32px] md:text-[42px] font-black tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            Costos de Envío Variables
          </h2>
          <p className="text-[14px] mt-3 max-w-[400px] mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>China → México con cotización en tiempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1000px] mx-auto">
          {methods.map((m, i) => {
            const key = (m.method || '').toLowerCase();
            const Icon = iconMap[key] || Icons.Package;
            const color = colorMap[key] || 'var(--blue)';
            const days = m.min_days && m.max_days ? `${m.min_days}-${m.max_days} días` : '';
            return (
              <div key={i} className="ship-card group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-500 hover:border-white/20">
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <span style={{ color }}><Icon size={24} /></span>
                </div>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: '#ffffff' }}>{m.method_label || m.method}</h3>
                <div className="text-[32px] font-black leading-none mb-1" style={{ color, fontFamily: 'var(--font-display)' }}>
                  ${mounted ? <AnimatedNumber target={m.cost_per_kg} /> : '0.00'}
                </div>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>por kg</span>
                <div className="w-8 h-px mx-auto my-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
                <div className="text-[11px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{days}</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{m.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Costos calculados en tiempo real según destino y peso. IVA incluido.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span className="text-[11px] font-medium">Pago Seguro SSL</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-[11px] font-medium">Compra Protegida</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span className="text-[11px] font-medium">Visa / Mastercard / PayPal</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            <span className="text-[11px] font-medium">Transferencia Bancaria</span>
          </div>
        </div>
      </div>
    </section>
  );
}
