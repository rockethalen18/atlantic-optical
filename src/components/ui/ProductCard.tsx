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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/productos/${product.slug}/`}
      className="group relative block bg-white border border-[var(--border)] hover:border-[var(--green)]/30 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,101,53,0.08)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[var(--bg-alt)] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-5 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Hover icon */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Icons.ArrowUpRight size={13} className="text-[var(--green)]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-[var(--green)] bg-[var(--green-light)] px-2 py-0.5 inline-block mb-2">
          {product.subcategory}
        </span>
        <h3 className="font-bold text-[var(--text)] text-[13px] leading-snug mb-1.5 line-clamp-2 group-hover:text-[var(--green)] transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-light)]">
          <span className="text-[9px] font-mono text-[var(--text-soft)]">{product.sku}</span>
          <span className="text-[11px] font-bold text-[var(--green)] flex items-center gap-1">
            Cotizar
            <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
