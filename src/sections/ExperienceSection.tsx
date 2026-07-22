import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

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

function ExperienceCard({ item, value }: { item: ExperienceItem; value: string }) {
  return (
    <AccordionItem
      value={value}
      className="exp-card glass-card accent-border overflow-hidden border border-white/[0.06] data-[state=open]:border-[#a89f91]/30 data-[state=open]:bg-white/[0.045]"
    >
      <AccordionTrigger className="min-h-[124px] w-full cursor-pointer px-5 py-5 md:px-7 md:py-6 hover:no-underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a89f91] [&>svg]:mr-1 [&>svg]:size-5 [&>svg]:text-white/35">
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-left md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <span className="block text-[18px] font-medium text-[#E8E8EC] md:text-[20px]">
              {item.title}
            </span>
            <p className="mt-1 text-[14px] text-white/50">{item.company}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pr-2 text-[12px] text-white/40 md:justify-end">
            <span>{item.period}</span>
            <span>{item.location}</span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-6 md:px-7 md:pb-7">
        <div className="border-t border-white/[0.06] pt-5">
          <ul className="space-y-2.5">
            {item.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 text-[14px] leading-[1.65] text-white/55"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#7c6f64]"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/[0.05] px-3 py-1 text-[12px] text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedRole, setExpandedRole] = useState('');

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

    tl.fromTo(
      cards,
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      },
    );

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

        <Accordion
          type="single"
          collapsible
          value={expandedRole}
          onValueChange={setExpandedRole}
          className="space-y-6"
        >
          {EXPERIENCE.map((item, index) => (
            <ExperienceCard
              key={`${item.company}-${item.title}`}
              item={item}
              value={`role-${index}`}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
