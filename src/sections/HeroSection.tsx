import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TECH_ICONS = [
  { name: 'AWS', icon: 'https://api.iconify.design/simple-icons/amazonwebservices.svg?color=white' },
  { name: 'GCP', icon: 'https://cdn.simpleicons.org/googlecloud/ffffff' },
  { name: 'Azure', icon: 'https://api.iconify.design/simple-icons/microsoftazure.svg?color=white' },
  { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/ffffff' },
  { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/ffffff' },
  { name: 'Helm', icon: 'https://cdn.simpleicons.org/helm/ffffff' },
  { name: 'ArgoCD', icon: 'https://cdn.simpleicons.org/argo/ffffff' },
  { name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform/ffffff' },
  { name: 'Pulumi', icon: 'https://cdn.simpleicons.org/pulumi/ffffff' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/githubactions/ffffff' },
  { name: 'GitLab', icon: 'https://cdn.simpleicons.org/gitlab/ffffff' },
  { name: 'Jenkins', icon: 'https://cdn.simpleicons.org/jenkins/ffffff' },
  { name: 'Prometheus', icon: 'https://cdn.simpleicons.org/prometheus/ffffff' },
  { name: 'Grafana', icon: 'https://cdn.simpleicons.org/grafana/ffffff' },
  { name: 'Python', icon: 'https://cdn.simpleicons.org/python/ffffff' },
  { name: 'Go', icon: 'https://cdn.simpleicons.org/go/ffffff' },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Label
    tl.to(labelRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.4);

    // Headline lines
    const lines = linesRef.current?.querySelectorAll('.headline-line');
    if (lines) {
      tl.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
      }, 0.5);
    }

    // Subheadline
    tl.to(subRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 1.0);

    // CTA
    tl.to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 1.2);

    // Tech icons
    const icons = iconsRef.current?.querySelectorAll('.tech-icon');
    if (icons) {
      tl.to(icons, {
        opacity: 0.5,
        duration: 0.4,
        stagger: 0.03,
      }, 1.0);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-[100dvh] flex items-center"
      style={{ paddingTop: '72px' }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Left Content */}
        <div className="max-w-[580px]">
          {/* Label */}
          <p
            ref={labelRef}
            className="font-mono-label opacity-0 translate-y-5 flex items-center gap-2"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#7c6f64]">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Senior Site Reliability Engineer
          </p>

          {/* Headline */}
          <div ref={linesRef} className="mt-6">
            <h1 className="font-display text-[44px] md:text-[80px] leading-[1.05] tracking-[-0.03em]">
              <span className="headline-line block opacity-0 translate-y-10 text-[#E8E8EC]">
                Engineering
              </span>
              <span className="headline-line block opacity-0 translate-y-10 gradient-text">
                reliability at scale
              </span>
              <span className="headline-line block opacity-0 translate-y-10 text-[#E8E8EC]">
                across multi-cloud
              </span>
              <span className="headline-line block opacity-0 translate-y-10 text-[#E8E8EC]">
                Kubernetes fleets
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="mt-8 text-[16px] leading-[1.6] max-w-[440px] opacity-0 translate-y-5"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Senior Site Reliability and DevSecOps Engineer with 10+ years of experience leading reliability, cloud platforms, observability, security, and automation for enterprise production workloads.
          </p>

          {/* CTA */}
          <a
            ref={ctaRef}
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center mt-10 px-6 py-3 text-[14px] font-medium tracking-[0.02em] rounded-full transition-all duration-300 opacity-0 translate-y-3"
            style={{
              background: '#E8E8EC',
              color: '#030305',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#ffffff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#E8E8EC';
            }}
          >
            About Me
          </a>
        </div>

        {/* Right Tech Icons */}
        <div
          ref={iconsRef}
          className="hidden lg:flex flex-col items-center gap-4 absolute right-[8vw] top-1/2 -translate-y-1/2"
        >
          <div className="flex flex-wrap justify-center gap-4 max-w-[140px]">
            {TECH_ICONS.map((tech, i) => (
              <div
                key={tech.name}
                className="tech-icon opacity-0 transition-opacity duration-300 hover:opacity-100"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0,
                }}
                title={tech.name}
              >
                <img
                  src={tech.icon}
                  alt={tech.name}
                  width={28}
                  height={28}
                  className="tech-icon-float"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: `${4 + (i % 3)}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
