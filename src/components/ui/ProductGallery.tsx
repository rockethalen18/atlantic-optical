'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';

interface ProductGalleryProps {
  images: string[];
  name: string;
  subcategory: string;
  hasDiscount: boolean;
  discountPercent?: number;
}

export default function ProductGallery({ images, name, subcategory, hasDiscount, discountPercent }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const allImages = images && images.length > 0 ? images : ['/images/extracted_images/placeholder.jpg'];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = useCallback(() => {
    setActiveIndex(i => (i === 0 ? allImages.length - 1 : i - 1));
  }, [allImages.length]);

  const nextImage = useCallback(() => {
    setActiveIndex(i => (i === allImages.length - 1 ? 0 : i + 1));
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, prevImage, nextImage]);

  return (
    <div className="sticky top-28">
      {/* Main image with hover zoom */}
      <div
        ref={mainRef}
        className="relative aspect-square bg-white border border-[var(--border)] overflow-hidden cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onClick={openLightbox}
      >
        <Image
          src={allImages[activeIndex]}
          alt={`${name} - imagen ${activeIndex + 1}`}
          fill
          className="object-contain p-6 transition-opacity duration-200"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {/* Zoom lens overlay */}
        {isZooming && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              background: `url(${allImages[activeIndex]})`,
              backgroundSize: '250%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              opacity: 0.9,
            }}
          />
        )}
        {/* Category badge */}
        <div className="absolute top-4 left-4 bg-[var(--green)] text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-[0.12em] z-10">
          {subcategory}
        </div>
        {/* Discount badge */}
        {hasDiscount && discountPercent && (
          <div className="absolute top-4 right-4 bg-[#dc2626] text-white text-[11px] font-black px-3 py-1.5 shadow-lg z-10">
            -{discountPercent}% OFF
          </div>
        )}
        {/* Image counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[11px] font-medium px-2.5 py-1 backdrop-blur-sm z-10">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
        {/* Click hint */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
          Clic para ampliar
        </div>
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-[10001] w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Prev arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 z-[10001] w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 z-[10001] w-12 h-12 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-[90vw] h-[85vh] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[activeIndex]}
              alt={`${name} - imagen ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Bottom thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[10001]">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`w-12 h-12 border-2 overflow-hidden transition-all ${
                    i === activeIndex
                      ? 'border-white shadow-lg scale-110'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Mini ${i + 1}`} className="w-full h-full object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[13px] font-medium px-4 py-1.5 backdrop-blur-sm z-[10001]">
            {activeIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
