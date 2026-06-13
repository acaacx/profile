import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import GlassCard from '../components/GlassCard';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  badge: string;
  badgeGradient: string;
  image: string;
  company: string;
  year: string;
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    badge: 'Days \u2192 Hours Onboarding',
    badgeGradient: 'linear-gradient(135deg, #4a7c6f 0%, #6fa89f 100%)',
    image: '/images/project-eks.jpg',
    company: 'Hydrolix',
    year: '2024 \u2013 Present',
    title: 'Internal Platform & Golden Paths',
    problem: 'No standardised platform for service onboarding. Teams provisioned environments manually, leading to drift, inconsistency, and slow release cycles.',
    solution: 'Defined platform roadmap and built Pulumi components for VPC, EKS/LKE/AKS, Grafana, and CNPG with ArgoCD app-of-apps. Established golden paths and reusable templates.',
    outcome: 'New-service onboarding reduced from days to hours. Change failure rate under 5%. MTTR down 60\u201375%. Sev-2 incidents reduced by 50%++.',
    tags: ['Pulumi', 'ArgoCD', 'EKS / LKE / AKS', 'Grafana', 'CNPG', 'GitHub Actions'],
  },
  {
    badge: '3\u20135\u00d7 deployment freq',
    badgeGradient: 'linear-gradient(135deg, #7c6f64 0%, #a89f91 100%)',
    image: '/images/project-cicd.jpg',
    company: 'Asurion',
    year: '2020 \u2013 2022',
    title: 'EKS Multi-Region Platform Modernisation',
    problem: 'Elasticsearch and OpenSearch platforms were manually managed across EC2 and ECS with no consistent CI/CD or IaC, causing slow deployments and high operational overhead.',
    solution: 'Migrated platforms to EKS. Standardised CI/CD using GitHub Actions, Terraform, and ArgoCD. Rolled out Helm-based deployments with blue-green and canary strategies.',
    outcome: 'Deployment frequency increased 3\u20135\u00d7. Change failure rate reduced by approximately 50%. Lead time cut by 75%. Operational overhead reduced.',
    tags: ['EKS', 'Terraform', 'ArgoCD', 'Helm', 'GitHub Actions', 'Prometheus', 'Grafana'],
  },
  {
    badge: 'GitOps Observability Stack',
    badgeGradient: 'linear-gradient(135deg, #6f4a7c 0%, #9f6fa8 100%)',
    image: '/images/project-cost.jpg',
    company: 'Demo / Personal',
    year: '2024',
    title: 'Observability Stack \u2014 LKE + New Relic + OpenTofu',
    problem: 'Needed a reproducible, code-driven observability stack to demonstrate SLO-based alerting and dashboard-as-code practices.',
    solution: 'Built a live Kubernetes observability stack on Linode LKE using New Relic, OpenTofu, and GitHub Actions. Dashboards and alert policies managed entirely as code.',
    outcome: 'Fully automated observability stack deployable end-to-end from a single pipeline run. Serves as a live demo of GitOps-driven observability.',
    tags: ['LKE', 'New Relic', 'OpenTofu', 'GitHub Actions', 'Kubernetes'],
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <GlassCard className="overflow-hidden h-full flex flex-col" hoverAccent>
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 text-[11px] font-medium rounded-full"
          style={{ background: project.badgeGradient, color: '#fff' }}
        >
          {project.badge}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[12px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {project.company} ({project.year})
        </p>
        <h3 className="text-[16px] font-medium text-[#E8E8EC] mb-4 leading-[1.4]">
          {project.title}
        </h3>

        <div className="space-y-3 mb-4 flex-1">
          <div>
            <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Problem</p>
            <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {project.problem}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Solution</p>
            <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {project.solution}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Outcome</p>
            <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {project.outcome}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.project-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 py-[80px] md:py-[120px]"
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionLabel text="golden-signals / prometheus \u00b7 grafana / cluster: production" />
        <h2 className="font-display text-[32px] md:text-[48px] tracking-[-0.02em] text-[#E8E8EC] mb-12">
          Flagship Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => (
            <div key={index} className="project-card">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Show all button */}
        <div className="flex justify-center mt-10">
          <a
            href="https://github.com/acaacx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] rounded-full transition-all duration-300 border"
            style={{
              background: 'transparent',
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#E8E8EC',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
