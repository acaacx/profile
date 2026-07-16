import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import GlassCard from '../components/GlassCard';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Site Reliability Engineer',
    company: 'Hydrolix',
    period: 'Jun 2024 \u2013 May 2026',
    location: 'Remote',
    bullets: [
      'Operated and supported 100+ Kubernetes clusters across AWS, GCP, Azure, and Linode, maintaining consistent reliability, security, and operational standards across production and pre-production environments.',
      'Built reusable Pulumi and Terraform components and Argo CD app-of-apps patterns, eliminating configuration drift and reducing new-service onboarding from days to hours.',
      'Designed Prometheus and Grafana monitoring for cluster health, ingestion, query performance, storage, capacity, databases, and backups; tuned alerts to improve signal quality and reduce response noise.',
      'Led 24/7 response for high-severity incidents, coordinating L2/L3 troubleshooting, stakeholder communication, RCA, blameless post-mortems, and corrective-action tracking.',
      'Managed peak-event capacity and scheduled scaling for intake, merge, and query services; resolved Kubernetes scheduling, autoscaling, resource pressure, pod failure, and metrics-server issues.',
      'Operated CloudNativePG PostgreSQL clusters, including replication, failover, backup validation, WAL archiving, connection saturation, deadlock, and recovery troubleshooting.',
      'Led vulnerability remediation, patching, and certificate lifecycle management using Vault and cloud-native secret managers; supported disaster-recovery tests and production-readiness reviews.',
      'Developed Python, Bash, and Go automation for cluster health checks, reporting, configuration validation, and repetitive SRE workflows.'
    ],
    tags: ['Kubernetes', 'ArgoCD', 'Pulumi', 'Terraform', 'Prometheus', 'Grafana', 'CloudNativePG', 'Python', 'Go'],
  },
  {
    title: 'DevSecOps Engineer',
    company: 'Omilia',
    period: 'Oct 2022 \u2013 Mar 2024',
    location: 'Remote / EMEA',
    bullets: [
      'Built and maintained GitLab-to-Jenkins CI/CD pipelines using reusable Jenkins modules and Groovy shared libraries to standardize build, test, image, and deployment workflows.',
      'Operated AWS EC2-hosted Docker Swarm platforms, including service deployments, rolling updates, scaling, health checks, networking, container recovery, and production troubleshooting.',
      'Managed application images in Amazon ECR and protected credentials and runtime configuration with AWS Secrets Manager and least-privilege IAM controls.',
      'Provisioned and maintained infrastructure using Terraform, including EC2, Application Load Balancers, routing, WAF protections, and supporting AWS services.',
      'Deployed, tuned, and supported Elastic Cloud and ELK observability for distributed voice-flow services; built Kibana dashboards and alerts for incident investigation and service health.',
      'Managed Prometheus and Grafana monitoring, availability targets, and error budgets; correlated deployment history, logs, metrics, and infrastructure events during incidents.',
      'Acted as incident commander, led root-cause analysis and corrective actions, and drove vulnerability remediation, patch management, and operational hardening.'
    ],
    tags: ['AWS', 'Docker Swarm', 'Terraform', 'ELK Stack', 'Jenkins', 'GitLab', 'Prometheus', 'Grafana'],
  },
  {
    title: 'Senior DevOps Engineer',
    company: 'Asurion',
    period: 'Oct 2017 \u2013 Oct 2022',
    location: 'Manila',
    bullets: [
      'Designed and operated AWS platforms using VPC, IAM, EC2, ECS Fargate, Kubernetes, Lambda, API Gateway, ALB/NLB, Route 53, CloudFront, WAF, S3, ECR, RDS, and AWS Secrets Manager.',
      'Built reusable Terraform modules, Ansible playbooks, Jenkins modules, GitHub Actions, and GitLab CI workflows across Development, SQA, UAT, and Production environments.',
      'Integrated Artifactory for controlled artifact versioning and promotion and embedded Snyk, SonarQube, and Checkov into delivery pipelines for automated DevSecOps controls.',
      'Implemented Argo CD GitOps, blue-green deployments, canary patterns, and feature flags, reducing change-failure rate by approximately 50% while preserving release velocity.',
      'Led Elasticsearch migration from EC2 to ECS, Kubernetes, and managed services with zero unplanned downtime and improved operational consistency.',
      'Provisioned monitoring and alerting through Terraform and CI/CD using CloudWatch, New Relic, Prometheus, Grafana, and EC2-hosted ELK platforms.',
      'Defined SLIs, SLOs, SLAs, and error budgets; built dashboards tied to latency, availability, and error-rate indicators and led production incident response and RCA.',
      'Coached developers on secure cloud design, production readiness, monitoring, runbooks, and sustainable on-call practices.'
    ],
    tags: ['AWS', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'ArgoCD', 'New Relic', 'Snyk'],
  },
  {
    title: 'Network Operations Engineer',
    company: 'Asurion',
    period: 'Jun 2014 \u2013 Oct 2017',
    location: 'Manila',
    bullets: [
      'Led a four-person team supporting 24/7 enterprise network operations, incident management, change execution, and infrastructure reliability.',
      'Led L2/L3 troubleshooting for availability, latency, packet loss, routing, BGP/OSPF, VPN, firewall, load-balancer, and certificate issues.',
      'Delivered WAN, SD-WAN, and data-center migration activities with zero unplanned downtime through disciplined change planning and stakeholder coordination.',
      'Managed ITIL incidents and escalations, conducted root-cause analysis, and authored post-incident reviews, troubleshooting guides, and operational runbooks.'
    ],
    tags: ['SD-WAN', 'BGP/OSPF', 'ITIL', 'Incident Management', 'Cisco', 'Network Operations'],
  },
];

function ExperienceCard({ item, isExpanded, onToggle }: {
  item: ExperienceItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <GlassCard hoverAccent className="relative" style={{ borderLeft: '2px solid rgba(255,255,255,0.06)' }}>
      <button
        className="w-full text-left"
        onClick={onToggle}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-[18px] font-medium text-[#E8E8EC]">{item.title}</h3>
            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.company}</p>
          </div>
          <div className="flex items-center gap-4 text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span>{item.period}</span>
            <span>{item.location}</span>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: isExpanded ? '600px' : '0', opacity: isExpanded ? 1 : 0 }}
        >
          <ul className="space-y-2 mt-4 mb-4">
            {item.bullets.map((bullet, i) => (
              <li key={i} className="text-[14px] leading-[1.6] flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#7c6f64' }} />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[12px] rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 pt-2" style={{ borderTop: isExpanded ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-300"
            style={{
              color: 'rgba(255,255,255,0.3)',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
    </GlassCard>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.exp-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(cards, {
      x: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 py-[80px] md:py-[120px]"
    >
      <div className="max-w-[800px] mx-auto px-6">
        <SectionLabel text="Work Experience" />
        <h2 className="font-display text-[32px] md:text-[48px] tracking-[-0.02em] text-[#E8E8EC] mb-12">
          Work Experience
        </h2>

        <div className="space-y-6">
          {EXPERIENCE.map((item, index) => (
            <div key={index} className="exp-card">
              <ExperienceCard
                item={item}
                isExpanded={expandedIndex === index}
                onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
