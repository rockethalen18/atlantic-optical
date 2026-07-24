'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

function AnimatedNumber({ target, decimals = 2, prefix = '' }: { target: number; decimals?: number; prefix?: string }) {
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

  return <span ref={ref}>{prefix}{val.toFixed(decimals)}</span>;
}

const methods = [
  {
    icon: Icons.Shipping,
    name: 'Marítimo',
    price: 4.50,
    time: '30-45 días',
    color: 'var(--blue)',
    desc: 'Ideal para equipos grandes y pesados',
  },
  {
    icon: Icons.Truck,
    name: 'Aéreo',
    price: 12.00,
    time: '7-15 días',
    color: '#60a5fa',
    desc: 'Equilibrio entre velocidad y costo',
  },
  {
    icon: Icons.Package,
    name: 'Express',
    price: 20.00,
    time: '3-7 días',
    color: '#93c5fd',
    desc: 'Máxima urgencia para equipos críticos',
  },
];

export default function ShippingBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.ship-card');
    gsap.set(els, { opacity: 0, y: 40, scale: 0.95 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, scale: 1,
      duration: 0.7, stagger: 0.15, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[var(--dark-bg)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--blue)] opacity-[0.04] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--green)] opacity-[0.03] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[var(--blue)]" />
            <span className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-[0.2em]">Envío Directo</span>
            <div className="w-8 h-[2px] bg-[var(--blue)]" />
          </div>
          <h2 className="text-[32px] md:text-[42px] font-black text-white tracking-[-0.04em]" style={{ fontFamily: 'var(--font-display)' }}>
            Costos de Envío Variables
          </h2>
          <p className="text-[14px] text-white/70 mt-3 max-w-[400px] mx-auto">China → Latinoamérica con cotización en tiempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
          {methods.map((m, i) => (
            <div key={i} className="ship-card group relative bg-white/[0.03] backdrop-blur-md border border-white/10 p-8 md:p-10 text-center hover:bg-white/[0.07] transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <span style={{ color: m.color }}><m.icon size={28} /></span>
              </div>

              <h3 className="text-[12px] font-bold text-white/80 uppercase tracking-[0.16em] mb-3">{m.name}</h3>

              <div className="text-[40px] font-black leading-none mb-1" style={{ color: m.color, fontFamily: 'var(--font-display)' }}>
                ${mounted ? <AnimatedNumber target={m.price} /> : '0.00'}
              </div>
              <span className="text-[10px] text-white/50 uppercase tracking-wider">por kg</span>

              <div className="w-10 h-px bg-white/10 mx-auto my-6" />

              <div className="text-[12px] font-semibold text-white/80 mb-1.5">{m.time}</div>
              <p className="text-[11px] text-white/60 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-[12px] text-white/50">Costos calculados en tiempo real según destino y peso. IVA incluido.</p>
        </div>
      </div>
    </section>
  );
}
