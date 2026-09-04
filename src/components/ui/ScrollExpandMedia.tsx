'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobileState(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const scrollRange = containerHeight - viewportHeight;

      if (scrolled < 0) {
        setScrollProgress(0);
      } else if (scrolled > scrollRange) {
        setScrollProgress(1);
      } else {
        setScrollProgress(scrolled / scrollRange);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={containerRef}
      style={{ height: '300vh' }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0 h-full transition-opacity duration-100"
          style={{ opacity: 1 - scrollProgress }}
        >
          <Image
            src={bgImageSrc}
            alt="Background"
            width={1920}
            height={1080}
            className="w-screen h-screen"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="container mx-auto flex flex-col items-center justify-center h-full relative z-10">
          {/* Expanding media */}
          <div
            className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: '95vw',
              maxHeight: '85vh',
              boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
              transition: 'width 0.05s, height 0.05s',
            }}
          >
            {mediaType === 'video' ? (
              <div className="relative w-full h-full pointer-events-none">
                <video
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover rounded-xl"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                />
                <div
                  className="absolute inset-0 bg-black/30 rounded-xl transition-opacity duration-100"
                  style={{ opacity: 0.7 - scrollProgress * 0.3 }}
                />
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={mediaSrc}
                  alt={title || 'Media content'}
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div
                  className="absolute inset-0 bg-black/50 rounded-xl transition-opacity duration-100"
                  style={{ opacity: 0.7 - scrollProgress * 0.3 }}
                />
              </div>
            )}

            {/* Text below media */}
            <div className="flex flex-col items-center text-center relative z-10 mt-4">
              {date && (
                <p
                  className="text-2xl text-white transition-transform duration-100"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {date}
                </p>
              )}
              {scrollToExpand && (
                <p
                  className="text-white font-medium text-center transition-transform duration-100"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {scrollToExpand}
                </p>
              )}
            </div>
          </div>

          {/* Title text */}
          <div
            className={`flex items-center justify-center text-center gap-4 w-full relative z-10 flex-col ${
              textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
            }`}
          >
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold transition-transform duration-100"
              style={{ fontFamily: 'var(--font-display)', transform: `translateX(-${textTranslateX}vw)`, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 4px 20px rgba(0,0,0,0.4)' }}
            >
              {firstWord}
            </h2>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center transition-transform duration-100"
              style={{ fontFamily: 'var(--font-display)', transform: `translateX(${textTranslateX}vw)`, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.7), 0 4px 20px rgba(0,0,0,0.4)' }}
            >
              {restOfTitle}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
