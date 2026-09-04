'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

// ============================================
// SCROLL REVEAL — plays once on enter
// ============================================

export function scrollReveal(
  elements: gsap.TweenTarget,
  fromVars: gsap.TweenVars = {},
  trigger?: Element | string,
  start = 'top 85%'
) {
  return gsap.fromTo(elements,
    { opacity: 0, y: 40, ...fromVars },
    {
      opacity: 1, y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger || (Array.isArray(elements) ? elements[0] : elements),
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

// ============================================
// PARALLAX — element moves at different speed
// ============================================

export function parallax(
  element: HTMLElement,
  speed = 0.3,
  options?: { start?: string; end?: string; scrub?: number }
) {
  return gsap.to(element, {
    y: `${speed * 100}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: options?.start || 'top bottom',
      end: options?.end || 'bottom top',
      scrub: options?.scrub ?? 1,
    },
  });
}

// ============================================
// CLIP REVEAL — clip-path scroll reveal
// ============================================

export function clipReveal(
  element: HTMLElement,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  options?: { scrub?: number; start?: string; end?: string }
) {
  const paths: Record<string, string> = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    top: 'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)',
  };

  return gsap.fromTo(element,
    { clipPath: paths[direction] },
    {
      clipPath: 'inset(0 0% 0 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: options?.start || 'top 80%',
        end: options?.end || 'top 30%',
        scrub: options?.scrub ?? 1.5,
      },
    }
  );
}

// ============================================
// STAGGER REVEAL — items appear one by one
// ============================================

export function staggerReveal(
  container: HTMLElement,
  selector: string,
  options?: { y?: number; stagger?: number; start?: string }
) {
  const items = container.querySelectorAll(selector);

  return gsap.fromTo(items,
    { opacity: 0, y: options?.y || 40 },
    {
      opacity: 1, y: 0,
      stagger: options?.stagger || 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: options?.start || 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// ============================================
// EXPANDING BLOB — circle morphs to fill section
// ============================================

export function expandingBlob(
  element: HTMLElement,
  options?: { start?: string; end?: string }
) {
  return gsap.fromTo(element,
    {
      borderRadius: '50%',
      scale: 0.3,
      opacity: 0.8,
      filter: 'blur(40px)',
    },
    {
      borderRadius: '0%',
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: options?.start || 'top 80%',
        end: options?.end || 'top 20%',
        scrub: 2,
      },
    }
  );
}

// ============================================
// HERO SCROLL FADE — content fades as you scroll past
// ============================================

export function heroScrollFade(
  section: HTMLElement,
  contentSelector: string,
  options?: { start?: string; end?: string }
) {
  const content = section.querySelectorAll(contentSelector);
  return gsap.to(content, {
    y: -80,
    opacity: 0,
    scale: 0.95,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: options?.start || 'center center',
      end: options?.end || 'bottom top',
      scrub: 1,
    },
  });
}

// ============================================
// IMAGE REVEAL MASK — clip from center
// ============================================

export function imageRevealMask(element: HTMLElement) {
  return gsap.fromTo(element,
    { clipPath: 'inset(50% 50% 50% 50%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
}

// ============================================
// SCALE ON SCROLL — element grows from small to full
// ============================================

export function scaleOnScroll(
  element: HTMLElement,
  from = 0.8,
  to = 1,
  options?: { start?: string; end?: string; scrub?: number }
) {
  return gsap.fromTo(element,
    { scale: from, opacity: 0.5 },
    {
      scale: to, opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: options?.start || 'top 90%',
        end: options?.end || 'top 30%',
        scrub: options?.scrub ?? 1,
      },
    }
  );
}

// ============================================
// ROTATE ON SCROLL — 3D tilt effect
// ============================================

export function rotateOnScroll(
  element: HTMLElement,
  from = 15,
  to = 0,
  axis: 'x' | 'y' | 'z' = 'x',
  options?: { start?: string; end?: string; scrub?: number }
) {
  const prop = `rotation${axis.toUpperCase()}` as 'rotationX' | 'rotationY' | 'rotationZ';
  return gsap.fromTo(element,
    { [prop]: from, opacity: 0.3 },
    {
      [prop]: to, opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: options?.start || 'top 90%',
        end: options?.end || 'top 30%',
        scrub: options?.scrub ?? 1,
      },
    }
  );
}

// ============================================
// COUNTER ON SCROLL — number animates when visible
// ============================================

export function counterOnScroll(
  element: HTMLElement,
  target: number,
  options?: { start?: string; duration?: number; decimals?: number }
) {
  const obj = { value: 0 };
  const decimals = options?.decimals ?? 0;
  return gsap.to(obj, {
    value: target,
    duration: options?.duration || 2,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = obj.value.toFixed(decimals);
    },
    scrollTrigger: {
      trigger: element,
      start: options?.start || 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ============================================
// HORIZONTAL SCROLL — content slides horizontally on vertical scroll
// ============================================

export function horizontalScroller(
  container: HTMLElement,
  track: HTMLElement,
  options?: { start?: string; end?: string }
) {
  const totalWidth = track.scrollWidth - container.clientWidth;

  return gsap.to(track, {
    x: -totalWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: options?.start || 'top top',
      end: () => `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}

// ============================================
// TEXT SPLIT REVEAL — words appear with scrub
// ============================================

export function textSplitReveal(
  element: HTMLElement,
  options?: { stagger?: number; start?: string; end?: string }
) {
  const text = element.textContent || '';
  const words = text.split(/\s+/).filter(Boolean);
  element.innerHTML = '';

  const spans = words.map((word) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    span.style.marginRight = '0.3em';
    span.style.opacity = '0.1';
    element.appendChild(span);
    return span;
  });

  return gsap.to(spans,
    {
      opacity: 1,
      y: 0,
      stagger: options?.stagger || 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: options?.start || 'top 80%',
        end: options?.end || 'bottom 50%',
        scrub: 1,
      },
    }
  );
}

// ============================================
// PIN SECTION — stays in viewport while scrolling
// ============================================

export function pinSection(
  trigger: Element | string,
  options?: { start?: string; end?: string; onEnter?: () => void; onLeave?: () => void }
) {
  return ScrollTrigger.create({
    trigger,
    start: options?.start || 'top top',
    end: options?.end || '+=100%',
    pin: true,
    pinSpacing: true,
    onEnter: options?.onEnter,
    onLeave: options?.onLeave,
  });
}

// ============================================
// REFRESH — call after dynamic content changes
// ============================================

export function refreshScrollTriggers(delay = 100) {
  setTimeout(() => ScrollTrigger.refresh(), delay);
}

export default gsap;
