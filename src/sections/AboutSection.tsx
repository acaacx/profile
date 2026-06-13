import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import GlassCard from '../components/GlassCard';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '10+ Yrs', label: 'SRE & DevOps Experience' },
  { value: '100+', label: 'Kubernetes Clusters' },
  { value: '4', label: 'Cloud Providers' },
  { value: '50%', label: 'Reduced Failure Rate' },
  { value: 'Hours', label: 'Onboarding (vs. Days)' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const heading = el.querySelector('.about-heading');
    const paragraphs = el.querySelectorAll('.about-paragraph');
    const socials = el.querySelector('.about-socials');
    const stats = el.querySelectorAll('.stat-card');
    const image = el.querySelector('.about-image');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    if (heading) {
      tl.from(heading, { x: -30, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0);
    }

    tl.from(paragraphs, { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, 0.2);

    if (socials) {
      tl.from(socials, { y: 10, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.5);
    }

    if (image) {
      tl.from(image, { x: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.3);
    }

    tl.from(stats, { y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, 0.4);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 py-[120px] md:py-[120px]"
    >
      <div className="max-w-[1000px] mx-auto px-6">
        <SectionLabel text="About Me" />

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Column - 55% */}
          <div className="w-full md:w-[55%]">
            <h2 className="about-heading font-display text-[32px] md:text-[48px] tracking-[-0.02em] text-[#E8E8EC] mb-8">
              About Me
            </h2>

            <p className="about-paragraph text-[16px] leading-[1.6] mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              I'm Alaric Acaac, a Senior Site Reliability and DevSecOps Engineer with 10+ years of experience leading reliability, cloud platforms, observability, security, and automation initiatives for enterprise production environments. I have operated 100+ Kubernetes clusters across AWS, GCP, Azure, and Linode.
            </p>

            <p className="about-paragraph text-[16px] leading-[1.6] mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              My focus is on eliminating configuration drift, building reusable IaC & CI/CD platforms, accelerating service delivery, and managing high-severity incident response. I specialize in GitOps, progressive delivery, and cloud cost-optimisation strategies that significantly reduce failure rates and engineering overhead.
            </p>

            <div className="about-socials flex flex-wrap items-center gap-3">
              <a
                href="https://www.linkedin.com/in/acaacx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-[13px] rounded-full transition-all duration-300 border"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#E8E8EC' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/acaacx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-[13px] rounded-full transition-all duration-300 border"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#E8E8EC' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                GitHub
              </a>
              <a
                href="mailto:ab.acaac@gmail.com"
                className="inline-flex items-center px-4 py-2 text-[13px] rounded-full transition-all duration-300 border"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#E8E8EC' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                ab.acaac@gmail.com
              </a>
            </div>
          </div>

          {/* Right Column - 45% */}
          <div className="w-full md:w-[45%] flex justify-center md:justify-end">
            <div className="about-image relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <img
                src="/images/profile-photo.jpg"
                alt="Alaric Acaac"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16">
          {STATS.map((stat) => (
            <GlassCard key={stat.label} className="stat-card p-6 text-center" hoverAccent>
              <p className="font-display text-[28px] md:text-[32px] text-[#E8E8EC]">
                {stat.value}
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
