'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icons from '@/components/ui/Icons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null;
  link: string | null;
  link_text: string | null;
  bg_color: string;
  text_color: string;
  animation: string;
}

const fallbackBanners: Banner[] = [];

export default function DynamicBanners({ position = 'home' }: { position?: string }) {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/banners?position=${position}`)
      .then(r => r.json())
      .then(data => {
        if (data?.data && data.data.length > 0) setBanners(data.data);
      })
      .catch(() => {});
  }, [position]);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % banners.length);
        setAnimating(false);
      }, 500);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners.length]);

  if (banners.length === 0) return null;

  const b = banners[current];

  return (
    <section className="relative overflow-hidden" style={{ background: b.bg_color }}>
      {b.image && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundImage: `url(${b.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}
      <div className="absolute inset-0" style={{ background: `${b.bg_color}cc` }} />
      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-12 md:py-20 relative z-10">
        <div className={`transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <h2 className="text-[24px] md:text-[36px] font-black mb-2" style={{ color: b.text_color, fontFamily: 'var(--font-display)' }}>
            {b.title}
          </h2>
          {b.subtitle && (
            <p className="text-[14px] md:text-[16px] mb-6 max-w-[500px]" style={{ color: `${b.text_color}cc` }}>
              {b.subtitle}
            </p>
          )}
          {b.link && (
            <Link href={b.link} className="inline-flex items-center gap-2 font-bold text-[12px] uppercase tracking-[0.08em] px-6 py-3 transition-all" style={{ background: b.text_color, color: b.bg_color }}>
              {b.link_text || 'Ver Mas'} <Icons.ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === current ? b.text_color : `${b.text_color}40` }} />
          ))}
        </div>
      )}
    </section>
  );
}
