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

export default function ShippingBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('.ship-card');
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 30 });
    gsap.to(els, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
    });
  }, [mounted]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--text)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 relative z-10">
        <div className="wow-fadeUp text-center mb-10">
          <span className="text-[10px] font-semibold text-[var(--green-status)] uppercase tracking-[0.18em]">Envío Directo</span>
          <h2 className="text-[28px] md:text-[38px] font-black text-white tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Costos de Envío Variables China → México
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-[960px] mx-auto">
          <div className="ship-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
            <Icons.Shipping className="mx-auto mb-3 text-[var(--green-status)]" size={28} />
            <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.1em] mb-1">Marítimo</h3>
            <div className="text-[28px] font-black text-[var(--green-status)]" style={{ fontFamily: 'var(--font-display)' }}>
              ${mounted ? <AnimatedNumber target={4.50} /> : '0.00'}
            </div>
            <span className="text-[11px] text-white/50">por kg</span>
          </div>

          <div className="ship-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
            <Icons.Truck className="mx-auto mb-3 text-[var(--amber)]" size={28} />
            <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.1em] mb-1">Aéreo</h3>
            <div className="text-[28px] font-black text-[var(--amber)]" style={{ fontFamily: 'var(--font-display)' }}>
              ${mounted ? <AnimatedNumber target={12.00} /> : '0.00'}
            </div>
            <span className="text-[11px] text-white/50">por kg</span>
          </div>

          <div className="ship-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
            <Icons.Package className="mx-auto mb-3 text-white" size={28} />
            <h3 className="text-[13px] font-bold text-white uppercase tracking-[0.1em] mb-1">Express</h3>
            <div className="text-[28px] font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
              ${mounted ? <AnimatedNumber target={20.00} /> : '0.00'}
            </div>
            <span className="text-[11px] text-white/50">por kg</span>
          </div>
        </div>

        <div className="wow-fadeUp text-center mt-8">
          <p className="text-[13px] text-white/50">Costos calculados en tiempo real según destino y peso. IVA incluido.</p>
        </div>
      </div>
    </section>
  );
}
