'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
  subcategory: string;
  hasDiscount: boolean;
  discountPercent?: number;
}

export default function ProductGallery({ images, name, subcategory, hasDiscount, discountPercent }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allImages = images && images.length > 0 ? images : ['/images/extracted_images/placeholder.jpg'];

  return (
    <div className="sticky top-28">
      {/* Main image */}
      <div className="relative aspect-square bg-white border border-[var(--border)] overflow-hidden group">
        <Image
          src={allImages[activeIndex]}
          alt={`${name} - imagen ${activeIndex + 1}`}
          fill
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-[var(--green)] text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-[0.12em]">
          {subcategory}
        </div>
        {/* Discount badge */}
        {hasDiscount && discountPercent && (
          <div className="absolute top-4 right-4 bg-[#dc2626] text-white text-[11px] font-black px-3 py-1.5 shadow-lg">
            -{discountPercent}% OFF
          </div>
        )}
        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[11px] font-medium px-2.5 py-1 backdrop-blur-sm">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 bg-white border-2 overflow-hidden cursor-pointer transition-all ${
                i === activeIndex
                  ? 'border-[var(--green)] shadow-md'
                  : 'border-[var(--border)] opacity-60 hover:opacity-100 hover:border-[var(--green)]/40'
              }`}
            >
              <img
                src={img}
                alt={`Miniatura ${i + 1} de ${name}`}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
