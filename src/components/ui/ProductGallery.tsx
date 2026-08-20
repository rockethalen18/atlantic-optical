'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const allImages = images && images.length > 0 ? images : ['/images/extracted_images/placeholder.jpg'];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const changeImage = useCallback((newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, []);

  const prevImage = useCallback(() => {
    changeImage(activeIndex === 0 ? allImages.length - 1 : activeIndex - 1);
  }, [activeIndex, allImages.length, changeImage]);

  const nextImage = useCallback(() => {
    changeImage(activeIndex === allImages.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, allImages.length, changeImage]);

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setIsTransitioning(false);
  }, []);

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
  }, [lightboxOpen, prevImage, nextImage, closeLightbox]);

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
        <div className="absolute top-4 left-4 bg-[var(--green)] text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-[0.12em] z-10">
          {subcategory}
        </div>
        {hasDiscount && discountPercent && (
          <div className="absolute top-4 right-4 bg-[#dc2626] text-white text-[11px] font-black px-3 py-1.5 shadow-lg z-10">
            -{discountPercent}% OFF
          </div>
        )}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[11px] font-medium px-2.5 py-1 backdrop-blur-sm z-10">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
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
              onClick={() => changeImage(i)}
              className={`flex-shrink-0 w-16 h-16 bg-white border-2 overflow-hidden cursor-pointer transition-all ${
                i === activeIndex
                  ? 'border-[var(--green)] shadow-md'
                  : 'border-[var(--border)] opacity-60 hover:opacity-100 hover:border-[var(--green)]/40'
              }`}
            >
              <img src={img} alt={`Miniatura ${i + 1} de ${name}`} className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center"
          onClick={closeLightbox}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between px-6 z-[10002]">
            <div className="text-white/80 text-[13px] font-medium">
              {name}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-[13px]">{activeIndex + 1} / {allImages.length}</span>
              <button
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                className="w-9 h-9 bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors rounded-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Prev arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[10002] w-14 h-14 bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 rounded-full group/btn"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:-translate-x-0.5 transition-transform">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[10002] w-14 h-14 bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 rounded-full group/btn"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-0.5 transition-transform">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Image container */}
          <div
            className="relative w-[85vw] h-[75vh] max-w-[1100px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative w-full h-full transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <Image
                src={allImages[activeIndex]}
                alt={`${name} - imagen ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="85vw"
              />
            </div>
          </div>

          {/* Bottom thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-4 z-[10002]">
              <div className="flex gap-2.5 justify-center px-4">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); changeImage(i); }}
                    className={`w-14 h-14 border-2 overflow-hidden transition-all flex-shrink-0 ${
                      i === activeIndex
                        ? 'border-white shadow-[0_0_12px_rgba(255,255,255,0.3)] scale-110'
                        : 'border-white/20 opacity-50 hover:opacity-90 hover:border-white/50'
                    }`}
                  >
                    <img src={img} alt={`Mini ${i + 1}`} className="w-full h-full object-contain p-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
