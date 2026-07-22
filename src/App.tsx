import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import WebGPUCanvas from './components/WebGPUCanvas';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { useLenis } from './hooks/useLenis';
import DesignsPage from './pages/DesignsPage';
import HomePage from './pages/HomePage';
import InteractivePage from './pages/InteractivePage';
import NotFoundPage from './pages/NotFoundPage';

interface ScrollControllerRef {
  current: {
    scrollTo(
      target: number | HTMLElement,
      options?: { force?: boolean; immediate?: boolean; offset?: number },
    ): void;
  } | null;
}

export function ScrollManager({ lenisRef }: { lenisRef: ScrollControllerRef }) {
  const location = useLocation();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (location.hash) {
      const frame = window.requestAnimationFrame(() => {
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
      return () => window.cancelAnimationFrame(frame);
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { force: true, immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [lenisRef, location.pathname, location.hash]);

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
