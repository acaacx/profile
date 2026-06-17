import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const heading = el.querySelector('.contact-heading');
    const subtext = el.querySelector('.contact-subtext');
    const ctas = el.querySelectorAll('.contact-cta');

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

    tl.fromTo(
      ctas,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'opacity,transform' },
      0.4
    );

    return () => {
      tl.kill();
    };
  }, []);

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

      </div>
    </section>
  );
}
