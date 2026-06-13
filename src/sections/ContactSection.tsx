import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const heading = el.querySelector('.contact-heading');
    const subtext = el.querySelector('.contact-subtext');
    const ctas = el.querySelectorAll('.contact-cta');
    const email = el.querySelector('.contact-email');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    if (heading) {
      tl.from(heading, { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0);
    }

    if (subtext) {
      tl.from(subtext, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
    }

    tl.from(ctas, { y: 15, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.4);

    if (email) {
      tl.from(email, { y: 10, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.6);
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ab.acaac@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[160px]"
    >
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <h2 className="contact-heading font-display text-[40px] md:text-[64px] tracking-[-0.02em] text-[#E8E8EC] leading-[1.1]">
          Let's work<br />together
        </h2>

        <p className="contact-subtext mt-6 text-[16px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Open to new roles, collaborations, or a conversation about SRE,
          Kubernetes, and infrastructure automation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <a
            href="https://www.linkedin.com/in/acaacx/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-cta inline-flex items-center px-8 py-3 text-[14px] font-medium tracking-[0.02em] rounded-full transition-all duration-300"
            style={{ background: '#E8E8EC', color: '#030305' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E8EC'; }}
          >
            Connect on LinkedIn
          </a>
          <a
            href="https://github.com/acaacx"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-cta inline-flex items-center px-6 py-3 text-[14px] rounded-full transition-all duration-300 border"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#E8E8EC' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            GitHub
          </a>
        </div>

        <button
          onClick={handleCopyEmail}
          className="contact-email mt-8 inline-flex items-center gap-2 text-[14px] font-mono transition-colors duration-200"
          style={{ color: copied ? '#4ade80' : 'rgba(255,255,255,0.3)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? 'Copied!' : 'ab.acaac@gmail.com'}
        </button>
      </div>
    </section>
  );
}
