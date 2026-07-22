import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import {
  NAV_ITEMS,
  getNavigationHref,
  isUnmodifiedPrimaryClick,
  type NavItem,
} from '../lib/navigation';

export default function Navigation() {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  const [menuState, setMenuState] = useState({ open: false, locationKey: location.key });
  const menuOpen = menuState.open && menuState.locationKey === location.key;

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    const sectionItems = NAV_ITEMS.filter((item) => item.kind === 'section');
    const handleScroll = () => {
      const visible = sectionItems
        .map((item) => {
          const element = document.getElementById(item.target);
          return element ? { id: item.target, top: element.getBoundingClientRect().top } : null;
        })
        .filter((item): item is { id: string; top: number } => item !== null);

      const current = visible.reduce<{ id: string; top: number } | null>((closest, item) => {
        if (item.top > 160) return closest;
        if (!closest || item.top > closest.top) return item;
        return closest;
      }, null);

      setActiveSection(current?.id ?? '');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuState({ open: false, locationKey: location.key });
      menuButtonRef.current?.focus();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [location.key, menuOpen]);

  const isItemActive = (item: NavItem) => {
    if (item.kind === 'route') return location.pathname === item.target;
    return location.pathname === '/' && activeSection === item.target;
  };

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!isUnmodifiedPrimaryClick(event)) return;

    const href = getNavigationHref(location.pathname, item);

    if (item.kind === 'section' && location.pathname === '/') {
      event.preventDefault();
      document.getElementById(item.target)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    } else {
      event.preventDefault();
      navigate(href);
    }

    setMenuState({ open: false, locationKey: location.key });
  };

  const renderLinks = (mobile = false) =>
    NAV_ITEMS.map((item) => {
      const active = isItemActive(item);
      const ariaCurrent = active ? (item.kind === 'route' ? 'page' : 'location') : undefined;

      return (
        <a
          key={`${mobile ? 'mobile' : 'desktop'}-${item.label}`}
          href={getNavigationHref(location.pathname, item)}
          onClick={(event) => handleNavigation(event, item)}
          className={`nav-link ${active ? 'nav-link-active' : ''} ${
            mobile ? 'w-full min-h-11 flex items-center text-[18px]' : 'text-[14px]'
          }`}
          aria-current={ariaCurrent}
        >
          {item.label}
        </a>
      );
    });

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center"
      style={{
        background: 'rgba(3,3,5,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-6">
        <a
          href="/"
          aria-label="Alaric Acaac — DevSecOps/SRE"
          className="font-display text-[20px] text-[#E8E8EC] tracking-normal rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a89f91]"
          onClick={(event) => {
            if (!isUnmodifiedPrimaryClick(event)) return;
            event.preventDefault();
            if (location.pathname === '/') {
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'auto'
                  : 'smooth',
              });
            } else {
              navigate('/');
            }
            setMenuState({ open: false, locationKey: location.key });
          }}
        >
          alaric@platform:~$
        </a>

        <div
          data-testid="desktop-navigation"
          className="hidden md:flex items-center justify-center gap-5 lg:gap-7 ml-auto"
        >
          {renderLinks()}
        </div>

        <div className="hidden lg:flex items-center">
          <a
            href="https://www.linkedin.com/in/acaacx/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-action"
          >
            LinkedIn
          </a>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="md:hidden min-w-11 min-h-11 inline-flex items-center justify-center rounded-full border border-white/10 text-[#E8E8EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a89f91]"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuState({ open: !menuOpen, locationKey: location.key })}
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute top-[72px] left-0 right-0 md:hidden px-6 py-5"
          style={{
            background: 'rgba(3,3,5,0.97)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-[1200px] mx-auto flex flex-col gap-2">{renderLinks(true)}</div>
        </div>
      )}
    </nav>
  );
}
