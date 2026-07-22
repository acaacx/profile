import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function getLenisOptions(reducedMotion: boolean) {
  return {
    lerp: reducedMotion ? 1 : 0.08,
    smoothWheel: !reducedMotion,
  };
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const rebuildLenis = () => {
      lenis?.destroy();
      lenis = new Lenis(getLenisOptions(motionPreference.matches));
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
    };

    const tick = (time: number) => {
      lenis?.raf(time * 1000);
    };

    rebuildLenis();
    motionPreference.addEventListener('change', rebuildLenis);
    gsap.ticker.add(tick);

    gsap.ticker.lagSmoothing(0);

    return () => {
      motionPreference.removeEventListener('change', rebuildLenis);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
