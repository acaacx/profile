import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

interface ToolCategory {
  name: string;
  tools: { name: string; icon: string }[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: 'Containers & GitOps',
    tools: [
      { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/ffffff' },
      { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker/ffffff' },
      { name: 'Helm', icon: 'https://cdn.simpleicons.org/helm/ffffff' },
      { name: 'Argo CD', icon: 'https://cdn.simpleicons.org/argo/ffffff' },
      { name: 'Traefik', icon: 'https://cdn.simpleicons.org/traefikproxy/ffffff' },
    ],
  },
  {
    name: 'Cloud & Platforms',
    tools: [
      { name: 'AWS', icon: 'https://api.iconify.design/simple-icons/amazonwebservices.svg?color=white' },
      { name: 'GCP', icon: 'https://cdn.simpleicons.org/googlecloud/ffffff' },
      { name: 'Azure', icon: 'https://api.iconify.design/simple-icons/microsoftazure.svg?color=white' },
      { name: 'Linode', icon: 'https://api.iconify.design/logos/linode.svg' },
    ],
  },
  {
    name: 'IaC & CI/CD Delivery',
    tools: [
      { name: 'Terraform', icon: 'https://cdn.simpleicons.org/terraform/ffffff' },
      { name: 'Pulumi', icon: 'https://cdn.simpleicons.org/pulumi/ffffff' },
      { name: 'Ansible', icon: 'https://cdn.simpleicons.org/ansible/ffffff' },
      { name: 'GitHub Actions', icon: 'https://cdn.simpleicons.org/githubactions/ffffff' },
      { name: 'GitLab CI', icon: 'https://cdn.simpleicons.org/gitlab/ffffff' },
      { name: 'Jenkins', icon: 'https://cdn.simpleicons.org/jenkins/ffffff' },
    ],
  },
  {
    name: 'SRE & Observability',
    tools: [
      { name: 'Prometheus', icon: 'https://cdn.simpleicons.org/prometheus/ffffff' },
      { name: 'Grafana', icon: 'https://cdn.simpleicons.org/grafana/ffffff' },
      { name: 'Elastic Stack', icon: 'https://cdn.simpleicons.org/elasticsearch/ffffff' },
      { name: 'New Relic', icon: 'https://cdn.simpleicons.org/newrelic/ffffff' },
      { name: 'Kafka', icon: 'https://cdn.simpleicons.org/apachekafka/ffffff' },
    ],
  },
  {
    name: 'Languages & Automation',
    tools: [
      { name: 'Python', icon: 'https://cdn.simpleicons.org/python/ffffff' },
      { name: 'Go', icon: 'https://cdn.simpleicons.org/go/ffffff' },
      { name: 'Bash', icon: 'https://cdn.simpleicons.org/gnubash/ffffff' },
      { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/ffffff' },
      { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/ffffff' },
      { name: 'Redis', icon: 'https://cdn.simpleicons.org/redis/ffffff' },
    ],
  },
];

export default function ToolsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const categories = el.querySelectorAll('.tool-category');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    tl.from(categories, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-[80px] md:py-[120px]"
    >
      <div className="max-w-[1000px] mx-auto px-6">
        <SectionLabel text="Tools & Technologies" />
        <h2 className="font-display text-[32px] md:text-[48px] tracking-[-0.02em] text-[#E8E8EC] mb-12">
          Tools & Technologies
        </h2>

        <div className="space-y-12">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.name} className="tool-category">
              <p className="font-mono-label mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {category.name}
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                {category.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <img
                        src={tool.icon}
                        alt={tool.name}
                        width={40}
                        height={40}
                        className="opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </div>
                    <span className="text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
