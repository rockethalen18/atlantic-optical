'use client';

import { useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export default function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register ScrollTrigger if available
    if (typeof window !== 'undefined' && gsap.registerPlugin) {
      // ScrollTrigger will be registered via the gsap lib setup
    }

    const reveals = document.querySelectorAll('.gsap-reveal');
    const animations: gsap.core.Tween[] = [];

    reveals.forEach((el) => {
      const direction = el.getAttribute('data-gsap-direction') || 'up';
      const delay = parseFloat(el.getAttribute('data-gsap-delay') || '0');
      const duration = parseFloat(el.getAttribute('data-gsap-duration') || '1');
      const staggerIndex = el.getAttribute('data-gsap-stagger');

      let fromVars: gsap.TweenVars = { opacity: 0 };

      switch (direction) {
        case 'up': fromVars.y = 80; break;
        case 'down': fromVars.y = -80; break;
        case 'left': fromVars.x = -80; break;
        case 'right': fromVars.x = 80; break;
        case 'scale': fromVars.scale = 0.85; break;
        case 'blur': fromVars.filter = 'blur(10px)'; fromVars.scale = 0.95; break;
        case 'slide-up': fromVars.y = '100%'; break;
        case 'rotate': fromVars.rotation = -5; fromVars.scale = 0.9; break;
        default: fromVars.y = 60;
      }

      const tween = gsap.from(el, {
        ...fromVars,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'bottom 12%',
          toggleActions: 'play none none reverse',
        },
      });

      animations.push(tween);
    });

    // Parallax elements
    const parallaxEls = document.querySelectorAll('[data-gsap-parallax]');
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-gsap-parallax') || '0.3');

      gsap.to(el, {
        y: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    // Scroll progress bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
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
    }

    return () => {
      animations.forEach(a => a.kill());
    };
  }, []);

  return <>{children}</>;
}
