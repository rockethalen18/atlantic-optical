'use client';

import { useState } from 'react';
import Icons from '@/components/ui/Icons';

export default function SeguimientoPage() {
  const [orderNum, setOrderNum] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[var(--green)] uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-[2px] bg-[var(--green)]" />Seguimiento<span className="w-6 h-[2px] bg-[var(--green)]" />
            </span>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-[var(--text)] mb-4">
              Rastrea tu pedido
            </h1>
            <p className="text-[var(--text-muted)] text-[15px]">
              Ingresa tu número de orden para conocer el estado de tu envío.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input type="text" placeholder="Número de orden (ej: AO-20260614-A1B2C3)" value={orderNum} onChange={e => setOrderNum(e.target.value)} className="flex-1 px-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] rounded-xl text-[14px] text-[var(--text)] focus:outline-none focus:border-[var(--green)] transition-colors" />
              <button className="px-6 py-3 bg-[var(--green)] text-white text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-[var(--green-hover)] transition-all duration-300 rounded-xl">
                <Icons.Search size={16} />
              </button>
            </div>
            <div className="mt-12 text-center text-[var(--text-muted)] text-[14px]">
              <Icons.Package size={40} className="mx-auto mb-3 text-[var(--border)]" />
              <p>Ingresa tu número de orden para ver el estado del envío.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
