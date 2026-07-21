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
    badge: 'tfsec Security Gate',
    badgeGradient: 'linear-gradient(135deg, #3d7c4a 0%, #6fa877 100%)',
    image: '/images/project-security.svg',
    company: 'Omilia',
    year: '2024',
    title: 'Security Team IaC Pipelines',
    problem: 'Security tooling (DefectDojo vulnerability management, NVD vulnerability mirror, network security baseline) had no standardised deploy pipeline, and Terraform changes shipped with no automated security scanning.',
    solution: 'Built Jenkins Job DSL pipelines backed by a shared Groovy library (AwsCloud / AzureCloud / TfCloudParams) to provision AWS infrastructure for security tooling via GitLab MR-triggered plan/apply workflows. Added a tfsec scanning stage to the NVD mirror pipeline, gating merges on Terraform misconfigurations.',
    outcome: 'Standardised multi-env (dev/prod) provisioning across 4+ security-team pipelines. Delivered the first automated security scanning gate on Terraform changes for the security org.',
    tags: ['Jenkins', 'Groovy DSL', 'Terraform', 'GitLab CI', 'tfsec', 'AWS'],
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
  {
    badge: 'Agent Eval Gate',
    badgeGradient: 'linear-gradient(135deg, #4a5c7c 0%, #6f8fa8 100%)',
    image: '/images/project-cicd.jpg',
    company: 'Personal',
    year: '2025',
    title: 'GCP Agentic CI/CD Pipeline',
    problem: 'CI pipelines verify code correctness but not AI agent behaviour — no automated gate for agent quality or regressions before deploy.',
    solution: 'Cloud Build pipeline runs an ADK evaluator as a sandboxed Cloud Run Job against golden datasets via Vertex AI (Gemini), streams trajectory metrics to BigQuery, and gates promotion through a pass/fail decision.',
    outcome: 'Passing builds auto-deploy the agent to Cloud Run and report status back to GitHub; failing evals block deployment before reaching production.',
    tags: ['Cloud Build', 'Cloud Run', 'Vertex AI', 'Gemini', 'BigQuery', 'ADK', 'GitHub'],
  },
  {
    badge: 'IaC End-to-End Deploys',
    badgeGradient: 'linear-gradient(135deg, #7c4a4a 0%, #a86f6f 100%)',
    image: '/images/project-cost.jpg',
    company: 'Asurion',
    year: '2020 – 2022',
    title: 'ECS Fargate Platform Pipeline',
    problem: 'Container deployments lacked a standardised, auditable pipeline — manual ECS updates and inconsistent Terraform application across accounts.',
    solution: 'Jenkins pipeline building containers to ECR, applying Terraform modules (state in S3 with DynamoDB locking) for VPC/ECS/ALB/WAF, and deploying Fargate services behind ALB target groups with health checks.',
    outcome: 'Fully automated build-to-deploy flow with CloudTrail, Config, and GuardDuty guardrails and New Relic APM/SLO coverage across the stack.',
    tags: ['ECS Fargate', 'Jenkins', 'Terraform', 'ECR', 'ALB', 'WAF', 'New Relic', 'CloudWatch'],
  },
  {
    badge: 'Zero-Downtime Cutovers',
    badgeGradient: 'linear-gradient(135deg, #7c6a4a 0%, #a8916f 100%)',
    image: '/images/project-eks.jpg',
    company: 'Asurion',
    year: '2016 – 2017',
    title: 'SD-WAN & Network Modernisation',
    problem: 'Aging WAN infrastructure across multiple sites with manual cutovers and no runbook coverage.',
    solution: 'Led WAN and SD-WAN rollouts and data-centre moves. Documented runbooks and DR plans with ITIL-aligned incident, problem, and change management.',
    outcome: 'All site cutovers completed with zero downtime. Runbooks reduced recovery time and eliminated knowledge silos.',
    tags: ['SD-WAN', 'BGP', 'OSPF', 'ITIL', 'Nagios', 'Splunk', 'Linux'],
  },
  {
    badge: 'Zero Standing Secrets',
    badgeGradient: 'linear-gradient(135deg, #4a7c7c 0%, #6fa8a8 100%)',
    image: '/images/project-security.svg',
    company: 'Personal',
    year: '2025',
    title: 'Entra ID Workload Identity & Least-Privilege Access',
    problem: 'CI/CD pipeline authenticated to Azure using a service principal client secret, manually rotated every 90 days — a standing credential and an operational burden.',
    solution: 'Registered a federated credential on an Entra ID app registration trusting GitHub Actions’ OIDC issuer. The pipeline exchanges a short-lived OIDC token for an Azure access token at runtime, scoped to a custom RBAC role limited to the target resource group rather than Contributor.',
    outcome: 'Eliminated the standing secret and its 90-day rotation process entirely; access is now fully auditable via Entra ID sign-in logs.',
    tags: ['Entra ID', 'Azure RBAC', 'GitHub Actions OIDC', 'Key Vault', 'AKS'],
  },
  {
    badge: '3 Vendors Removed',
    badgeGradient: 'linear-gradient(135deg, #7c5a4a 0%, #a8836f 100%)',
    image: '/images/project-cost.jpg',
    company: 'Personal',
    year: '2025',
    title: 'Security Tool Consolidation Case Study',
    problem: 'Fragmented tooling — overlapping CVE databases across SCA tools, inconsistent severity scoring, redundant secret stores, and duplicate log pipelines feeding no actionable insight.',
    solution: 'Audited a pipeline running 6 overlapping scanners, 3 secret stores, and 2 logging systems, mapped each tool to its real coverage, and consolidated onto Microsoft Defender for Cloud plus native GitHub/Azure DevOps scanning.',
    outcome: 'Removed 3 third-party vendors entirely, replaced three disagreeing severity scores with one coverage model, and lowered licensing and maintenance cost.',
    tags: ['Microsoft Defender for Cloud', 'GitHub Advanced Security', 'Azure DevOps', 'SCA', 'Vulnerability Management'],
  },
  {
    badge: '3 Alerts, Not 30',
    badgeGradient: 'linear-gradient(135deg, #4a6f7c 0%, #6f9fa8 100%)',
    image: '/images/project-cicd.jpg',
    company: 'Personal',
    year: '2025',
    title: 'Observability Tuned for Signal, Not Noise',
    problem: 'Default observability setups alert on everything, which trains on-call engineers to ignore alerts.',
    solution: 'Built an Azure Monitor / Log Analytics / Application Insights setup around 3 curated, high-signal KQL alerts — authentication failure spikes, pod crash-loop detection, and anomalous Key Vault access — with routine autoscaling events, individual pod restarts, and non-critical dependency latency deliberately left unalerted.',
    outcome: 'A small, trustworthy alert set where every notification is worth acting on.',
    tags: ['Azure Monitor', 'Log Analytics', 'Application Insights', 'KQL', 'Sentinel'],
  },
  {
    badge: 'Zero Critical Releases',
    badgeGradient: 'linear-gradient(135deg, #5c4a7c 0%, #8a6fa8 100%)',
    image: '/images/project-security.svg',
    company: 'Personal',
    year: '2025',
    title: 'Policy-as-Code Gate with Pragmatic Exception Path',
    problem: 'All-or-nothing security gates push engineers to route around the pipeline instead of through it.',
    solution: 'Built an OPA/Gatekeeper policy gate, evaluated via Conftest, that checks signature presence, SBOM presence, and CVE severity on signed, SBOM-attached build artifacts. Critical findings hard-block deployment; medium findings generate a linked, time-boxed risk-acceptance ticket and proceed to production.',
    outcome: 'Zero critical-severity releases shipped; medium findings tracked and resolved on a deadline instead of accumulating silently or blocking indefinitely.',
    tags: ['OPA', 'Gatekeeper', 'Conftest', 'Cosign', 'Syft (SBOM)'],
  },
  {
    badge: 'Zero Secrets in Source',
    badgeGradient: 'linear-gradient(135deg, #7c4a5c 0%, #a86f8a 100%)',
    image: '/images/project-security.svg',
    company: 'Personal',
    year: '2025',
    title: 'Secrets Management Migration',
    problem: 'Plaintext secrets committed directly into config files in source control.',
    solution: 'Migrated every secret into Azure Key Vault with access policies defined and version-controlled via Terraform, then added a Gitleaks pre-commit hook plus a non-bypassable pipeline-level scan to stop regressions.',
    outcome: 'Zero secrets in source; every secret reference resolved at runtime and never stored in the repo.',
    tags: ['Azure Key Vault', 'Terraform', 'Gitleaks'],
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
