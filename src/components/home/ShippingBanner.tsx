'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

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
        const dur = 2000;
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          setVal((1 - Math.pow(1 - p, 4)) * target);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>${val.toFixed(decimals)}</span>;
}

const methods = [
  { icon: Icons.Shipping, name: 'Marítimo', price: 4.50, time: '30-45 días', desc: 'Equipos grandes y pesados' },
  { icon: Icons.Truck, name: 'Aéreo', price: 12.00, time: '7-15 días', desc: 'Velocidad y costo equilibrados' },
  { icon: Icons.Package, name: 'Express', price: 20.00, time: '3-7 días', desc: 'Máxima urgencia' },
];

export default function ShippingBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.ship-card');
    gsap.set(els, { opacity: 0, y: 40 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 relative overflow-hidden bg-[var(--bg-alt)]">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.2em] block mb-3">Envío Directo</span>
          <h2 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>Costos de Envío Variables</h2>
          <p className="text-[15px] text-[var(--text-muted)] mt-3">China → Latinoamérica con cotización en tiempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {methods.map((m, i) => (
            <div key={i} className="ship-card group text-center p-10 bg-white border border-[var(--border)] hover:border-[var(--blue)]/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[var(--bg-alt)] border border-[var(--border)] group-hover:border-[var(--blue)]/30 transition-colors">
                <m.icon size={26} className="text-[var(--blue)]" />
              </div>
              <h3 className="text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-[0.16em] mb-4">{m.name}</h3>
              <div className="text-[44px] font-black leading-none mb-1 text-[var(--blue)]" style={{ fontFamily: 'var(--font-display)' }}>
                {mounted ? <AnimatedNumber target={m.price} /> : '$0.00'}
              </div>
              <span className="text-[11px] text-[var(--text-soft)] uppercase tracking-wider">por kg</span>
              <div className="w-8 h-px bg-[var(--border-light)] mx-auto my-6" />
              <div className="text-[13px] font-semibold text-[var(--text)] mb-1">{m.time}</div>
              <p className="text-[12px] text-[var(--text-muted)]">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
