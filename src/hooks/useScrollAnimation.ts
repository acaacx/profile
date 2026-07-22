import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  delay?: number;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    y = 40,
    x = 0,
    scale,
    opacity = 0,
    duration = 0.7,
    stagger = 0.1,
    ease = 'power2.out',
    start = 'top 80%',
    delay = 0,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = { opacity };
    if (y !== 0) fromVars.y = y;
    if (x !== 0) fromVars.x = x;
    if (scale !== undefined) fromVars.scale = scale;

    const children = el.querySelectorAll('[data-animate]');
    const targets = children.length > 0 ? children : el;

    const tween = gsap.from(targets, {
      ...fromVars,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === el)
        .forEach((st) => st.kill());
    };
  }, [delay, duration, ease, opacity, scale, stagger, start, x, y]);

  return ref;
}
