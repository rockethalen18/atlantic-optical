'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Icons } from './Icons';

interface ProductCardProps {
  product: {
    sku: string;
    name: string;
    slug: string;
    category: string;
    category_slug: string;
    subcategory: string;
    subcategory_slug: string;
    description: string;
    image: string;
    barcode?: string;
    reference?: string;
    price_mxn?: number | null;
    compare_price_mxn?: number | null;
  };
}

function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasPrice = product.price_mxn && product.price_mxn > 0;
  const hasPromo = hasPrice && product.compare_price_mxn && product.compare_price_mxn > product.price_mxn!;
  const discountPct = hasPromo ? Math.round(((product.compare_price_mxn! - product.price_mxn!) / product.compare_price_mxn!) * 100) : 0;

  return (
    <Link
      href={`/productos/${product.slug}/`}
      className="group relative block bg-white border border-[var(--border)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[var(--bg-alt)] overflow-hidden flex items-center justify-center p-5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-5 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Discount badge */}
        {hasPromo && discountPct > 0 && (
          <div className="absolute top-3 left-3 bg-[#dc2626] text-white text-[10px] font-black px-2.5 py-1 shadow-lg z-10">
            -{discountPct}%
          </div>
        )}
        {/* Hover icon */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-[var(--shadow)]">
          <Icons.ArrowUpRight size={13} className="text-[var(--green)]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[var(--blue)]">
          {product.subcategory}
        </span>
        <h3 className="font-bold text-[var(--text)] text-[13px] leading-snug mt-1 mb-1.5 line-clamp-2 group-hover:text-[var(--green)] transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price section */}
        {hasPrice ? (
          <div className="pt-2.5 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              {hasPromo && (
                <span className="text-[12px] text-[var(--text-muted)] line-through">
                  {formatMXN(product.compare_price_mxn!)}
                </span>
              )}
              <span className="text-[15px] font-black text-[var(--green)]">
                {formatMXN(product.price_mxn!)}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[var(--text-soft)]">{product.sku}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-light)]">
            <span className="text-[9px] font-mono text-[var(--text-soft)]">{product.sku}</span>
            <span className="text-[11px] font-bold text-[var(--green)] flex items-center gap-1">
              Cotizar
              <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
