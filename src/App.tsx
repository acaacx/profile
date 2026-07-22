import { useEffect, useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router';
import WebGPUCanvas from './components/WebGPUCanvas';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { useLenis } from './hooks/useLenis';
import DesignsPage from './pages/DesignsPage';
import HomePage from './pages/HomePage';
import InteractivePage from './pages/InteractivePage';
import NotFoundPage from './pages/NotFoundPage';
import { getRouteScrollTarget } from './lib/scroll';

interface ScrollControllerRef {
  current: {
    resize?(): void;
    scrollTo(
      target: number | HTMLElement,
      options?: { force?: boolean; immediate?: boolean; offset?: number },
    ): void;
  } | null;
}

export function ScrollManager({ lenisRef }: { lenisRef: ScrollControllerRef }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const savedPositions = useRef(new Map<string, number>());

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    const positions = savedPositions.current;
    const savePosition = () => positions.set(location.key, window.scrollY);

    savePosition();
    window.addEventListener('scroll', savePosition, { passive: true });
    return () => window.removeEventListener('scroll', savePosition);
  }, [location.key]);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const positions = savedPositions.current;
    const savedTarget = getRouteScrollTarget(
      navigationType,
      positions.get(location.key),
    );
    let frame: number | undefined;

    lenisRef.current?.resize?.();

    if (savedTarget !== undefined) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(savedTarget, { force: true, immediate: true });
      } else {
        window.scrollTo({ top: savedTarget, behavior: 'auto' });
      }
    } else if (location.hash) {
      frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1));
        if (!target) return;

        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, {
            force: true,
            immediate: reducedMotion,
            offset: -88,
          });
        } else {
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        }
      });
    } else {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { force: true, immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [lenisRef, location.key, location.pathname, location.hash, navigationType]);

  return null;
}

export function PortfolioRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/interactive" element={<InteractivePage />} />
      <Route path="/designs" element={<DesignsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AppShell() {
  const lenisRef = useLenis();

  return (
    <>
      <ScrollManager lenisRef={lenisRef} />
      <WebGPUCanvas />
      <Navigation />
      <main className="relative z-10">
        <PortfolioRoutes />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
