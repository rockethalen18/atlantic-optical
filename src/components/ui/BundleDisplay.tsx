'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icons from '@/components/ui/Icons';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface BundleItem {
  product_id: number;
  name: string;
  sku: string;
  quantity: number;
}

interface Bundle {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  bundle_price_usd: number;
  image: string | null;
  items: BundleItem[];
}

export default function BundleDisplay({ productId }: { productId?: number }) {
  const [bundles, setBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/bundles`)
      .then(r => r.json())
      .then(data => {
        if (data?.data) {
          let list = data.data.filter((b: Bundle) => b.items && b.items.length > 0);
          if (productId) {
            list = list.filter((b: Bundle) => b.items.some((i: BundleItem) => i.product_id === productId));
          }
          setBundles(list.slice(0, 3));
        }
      })
      .catch(() => {});
  }, [productId]);

  if (bundles.length === 0) return null;

  return (
    <section className="max-w-[1680px] mx-auto px-6 md:px-10 py-10">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 bg-[var(--blue)]/10 flex items-center justify-center">
          <Icons.Package size={16} className="text-[var(--blue)]" />
        </div>
        <h2 className="text-[16px] font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Paquetes / Bundles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bundles.map(bundle => (
          <div key={bundle.id} className="bg-white border border-[var(--border)] hover:border-[var(--blue)]/30 transition-colors p-5">
            <h3 className="font-bold text-[var(--text)] text-[14px] mb-2">{bundle.name}</h3>
            {bundle.description && <p className="text-[12px] text-[var(--text-muted)] mb-3">{bundle.description}</p>}
            <div className="space-y-1 mb-3">
              {bundle.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
                  <Icons.CheckCircle size={12} className="text-[var(--green)]" />
                  <span>{item.name} x{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
              <span className="text-[18px] font-black text-[var(--blue)]" style={{ fontFamily: 'var(--font-display)' }}>
                ${bundle.bundle_price_usd.toFixed(2)} USD
              </span>
              <Link href="/contacto" className="text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.06em] hover:underline">
                Cotizar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
