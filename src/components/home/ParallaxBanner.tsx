'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';

export default function ParallaxBanner() {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !bgRef.current || !textRef.current) return;

    // Parallax background - moves slower than scroll
    gsap.to(bgRef.current, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    // Text parallax - moves faster
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section ref={ref} className="relative h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center">
      {/* Parallax background layer */}
      <div ref={bgRef} className="absolute inset-[-20%] w-[140%] h-[140%]" style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 40%, #38bdf8 100%)',
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        {/* Floating geometric shapes */}
        <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] border border-white/10 rotate-45 animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[15%] right-[15%] w-[150px] h-[150px] border border-white/10 rotate-12 animate-[float_8s_ease-in-out_infinite_1s]" />
        <div className="absolute top-[60%] left-[60%] w-[100px] h-[100px] bg-white/5 rounded-full animate-[float_5s_ease-in-out_infinite_0.5s]" />
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-[800px]">
        <span className="text-[12px] font-bold text-white/60 uppercase tracking-[0.25em] block mb-5">Programa de Distribuidores</span>
        <h2 className="text-[32px] sm:text-[40px] md:text-[64px] font-black text-white tracking-[-0.04em] leading-[1.05] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Haz crecer tu negocio con nosotros
        </h2>
        <p className="text-[16px] md:text-[18px] text-white/70 leading-[1.7] mb-10 max-w-[600px] mx-auto">
          Únete a nuestra red de distribuidores en 35+ países. Margenes preferenciales, soporte exclusivo y exclusividad territorial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/distribuidores" className="group inline-flex items-center justify-center gap-3 bg-white text-[var(--text)] font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4.5 hover:bg-white/95 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
            Ser Distribuidor <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/oem-odm" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white border border-white/25 font-bold text-[13px] uppercase tracking-[0.1em] px-10 py-4.5 hover:bg-white/25 transition-all duration-300">
            OEM & ODM
          </Link>
        </div>
      </div>
    </section>
  );
}
