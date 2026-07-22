'use client';

import { useState, useEffect } from 'react';
import Icons from '@/components/ui/Icons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Popup {
  id: number;
  title: string;
  content: string;
  image: string | null;
  bg_color: string;
  text_color: string;
  button_text: string | null;
  button_color: string;
  button_link: string | null;
  position: string;
  trigger_type: string;
  trigger_value: number;
  frequency: string;
}

export default function DynamicPopup() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/popups`)
      .then(r => r.json())
      .then(data => {
        if (!data?.data || data.data.length === 0) return;
        const active = data.data.find((p: Popup) => p.button_text !== null || p.content);
        if (!active) return;

        const storageKey = `popup_${active.id}`;
        if (active.frequency === 'once' && localStorage.getItem(storageKey)) return;
        if (active.frequency === 'daily') {
          const last = localStorage.getItem(storageKey);
          if (last && (Date.now() - parseInt(last)) < 86400000) return;
        }

        setPopup(active);

        if (active.trigger_type === 'delay') {
          setTimeout(() => setVisible(true), active.trigger_value || 3000);
        } else if (active.trigger_type === 'scroll') {
          const handler = () => {
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (pct >= (active.trigger_value || 50)) {
              setVisible(true);
              window.removeEventListener('scroll', handler);
            }
          };
          window.addEventListener('scroll', handler, { passive: true });
          return () => window.removeEventListener('scroll', handler);
        } else if (active.trigger_type === 'exit-intent') {
          const handler = (e: MouseEvent) => {
            if (e.clientY < 10) {
              setVisible(true);
              document.removeEventListener('mouseleave', handler);
            }
          };
          document.addEventListener('mouseleave', handler);
          return () => document.removeEventListener('mouseleave', handler);
        }
      })
      .catch(() => {});
  }, []);

  const close = () => {
    setVisible(false);
    if (popup) {
      const key = `popup_${popup.id}`;
      if (popup.frequency === 'once' || popup.frequency === 'daily') {
        localStorage.setItem(key, Date.now().toString());
      }
    }
  };

  if (!popup || !visible) return null;

  const positionClass = popup.position === 'bottom-right' ? 'bottom-4 right-4' :
    popup.position === 'bottom-left' ? 'bottom-4 left-4' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className={`absolute ${positionClass} max-w-[480px] w-[90vw] shadow-2xl`} style={{ background: popup.bg_color, color: popup.text_color }}>
        <button onClick={close} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors" style={{ color: popup.text_color }}>
          <Icons.X size={18} />
        </button>
        {popup.image && (
          <img src={popup.image} alt={popup.title} className="w-full h-[180px] object-cover" />
        )}
        <div className="p-6">
          <h3 className="text-[18px] font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{popup.title}</h3>
          <div className="text-[13px] leading-[1.7] mb-4 opacity-80" dangerouslySetInnerHTML={{ __html: popup.content }} />
          <div className="flex gap-3">
            {popup.button_text && popup.button_link && (
              <a href={popup.button_link} className="inline-flex items-center gap-2 px-6 py-2.5 font-bold text-[12px] uppercase tracking-[0.08em] transition-colors" style={{ background: popup.button_color, color: '#ffffff' }}>
                {popup.button_text}
              </a>
            )}
            <button onClick={close} className="px-4 py-2.5 text-[12px] font-medium opacity-60 hover:opacity-100 transition-opacity" style={{ color: popup.text_color }}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
