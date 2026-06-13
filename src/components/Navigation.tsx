import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Sandbox', href: '#lab' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.from(nav, {
      opacity: 0,
      y: -10,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.2,
    });

    // Track active section
    const handleScroll = () => {
      const sections = NAV_LINKS.map((link) => {
        const el = document.querySelector(link.href);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { id: link.href.slice(1), top: rect.top };
      }).filter(Boolean);

      const current = sections.reduce((closest, section) => {
        if (!section) return closest;
        if (!closest) return section;
        if (section.top > -100 && section.top < closest.top) return section;
        return closest;
      }, sections[0]);

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center opacity-0"
      style={{
        background: 'rgba(3,3,5,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-display text-[20px] text-[#E8E8EC] tracking-normal"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          alaric@platform:~$
        </a>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-[14px] font-normal tracking-[0.02em] transition-colors duration-300"
              style={{
                color: activeSection === link.href.slice(1) ? '#E8E8EC' : 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#E8E8EC';
              }}
              onMouseLeave={(e) => {
                if (activeSection !== link.href.slice(1)) {
                  (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/acaacx/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-4 py-2 text-[13px] tracking-[0.02em] rounded-full transition-all duration-300 border"
            style={{
              background: 'transparent',
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#E8E8EC',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            LinkedIn
          </a>
          <span
            className="px-3 py-1 text-[12px] rounded-full"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            EN
          </span>
        </div>
      </div>
    </nav>
  );
}
