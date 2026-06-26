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
    color: '#2563eb',
    desc: 'Ideal para equipos grandes y pesados. Opción más económica.',
  },
  {
    icon: Icons.Truck,
    name: 'Aéreo',
    price: 12.00,
    time: '7-15 días',
    color: '#f59e0b',
    desc: 'Equilibrio entre velocidad y costo. Para pedidos medianos.',
  },
  {
    icon: Icons.Package,
    name: 'Express',
    price: 20.00,
    time: '3-7 días',
    color: '#60a5fa',
    desc: 'Máxima urgencia. Para equipos críticos y repuestos.',
  },
];

export default function ShippingBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.ship-card');
    gsap.set(els, { opacity: 0, y: 30, scale: 0.97 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, scale: 1,
      duration: 0.6, stagger: 0.12, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-28 bg-[#0a1628] relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
      {/* Floating orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--green)] opacity-[0.05] rounded-full blur-[120px]" />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Envío Directo</span>
          <h2 className="text-[32px] md:text-[42px] font-black text-white tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Costos de Envío Variables
          </h2>
          <p className="text-[14px] text-white/50 mt-3 max-w-[400px] mx-auto">China → México con cotización en tiempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1000px] mx-auto">
          {methods.map((m, i) => (
            <div key={i} className="ship-card group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-500 hover:border-white/20">
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <span style={{ color: m.color }}><m.icon size={24} /></span>
              </div>

              {/* Name */}
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.14em] mb-2">{m.name}</h3>

              {/* Price */}
              <div className="text-[32px] font-black leading-none mb-1" style={{ color: m.color, fontFamily: 'var(--font-display)' }}>
                ${mounted ? <AnimatedNumber target={m.price} /> : '0.00'}
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">por kg</span>

              {/* Divider */}
              <div className="w-8 h-px bg-white/10 mx-auto my-5" />

              {/* Time */}
              <div className="text-[11px] font-semibold text-white/70 mb-1">{m.time}</div>
              <p className="text-[11px] text-white/40 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-[12px] text-white/30">Costos calculados en tiempo real según destino y peso. IVA incluido.</p>
        </div>
      </div>
    </section>
  );
}
