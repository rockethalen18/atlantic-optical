'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface UseGsapScrollOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

export function useGsapScrollReveal(
  selector: string = '.gsap-reveal',
  options: UseGsapScrollOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    const {
      start = 'top 85%',
      end = 'bottom 15%',
      scrub = false,
      markers = false,
    } = options;

    const animations: gsap.core.Tween[] = [];

    elements.forEach((el, i) => {
      const direction = el.getAttribute('data-gsap-direction') || 'up';
      const delay = parseFloat(el.getAttribute('data-gsap-delay') || '0');
      const duration = parseFloat(el.getAttribute('data-gsap-duration') || '1');

      let fromVars: gsap.TweenVars = { opacity: 0 };

      switch (direction) {
        case 'up':
          fromVars.y = 80;
          break;
        case 'down':
          fromVars.y = -80;
          break;
        case 'left':
          fromVars.x = -80;
          break;
        case 'right':
          fromVars.x = 80;
          break;
        case 'scale':
          fromVars.scale = 0.85;
          break;
        case 'blur':
          fromVars.filter = 'blur(10px)';
          fromVars.scale = 0.95;
          break;
        case 'slide-up':
          fromVars.y = '120%';
          break;
        case 'rotate':
          fromVars.rotation = -5;
          fromVars.scale = 0.9;
          break;
        default:
          fromVars.y = 60;
      }

      const tween = gsap.from(el, {
        ...fromVars,
        duration: scrub ? 1 : duration,
        delay: scrub ? 0 : delay,
        ease: scrub ? 'none' : 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: scrub ? 'top bottom' : start,
          end: scrub ? 'bottom top' : end,
          toggleActions: 'play none none reverse',
          ...(scrub ? { scrub: typeof scrub === 'number' ? scrub : 1 } : {}),
          markers,
        },
      });

      animations.push(tween);
    });

    return () => {
      animations.forEach(a => a.kill());
    };
  }, [selector, options.trigger, options.start, options.end, options.scrub, options.markers]);

  return containerRef;
}

export function useGsapParallax() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-gsap-parallax]');
    const animations: gsap.core.Tween[] = [];

    elements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-gsap-parallax') || '0.3');
      const direction = el.getAttribute('data-gsap-parallax-direction') || 'y';

      const tween = gsap.to(el, {
        [direction]: () => -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      animations.push(tween);
    });

    return () => {
      animations.forEach(a => a.kill());
    };
  }, []);
}

export function useGsapScrollProgress() {
  useEffect(() => {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    gsap.to(progressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }, []);
}
