import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import GlassCard from '../components/GlassCard';

gsap.registerPlugin(ScrollTrigger);

// Cost Calculator Component
function CostCalculator() {
  const [clusters, setClusters] = useState(150);
  const [computeBill, setComputeBill] = useState(50);
  const [teamSize, setTeamSize] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(100);
  const [wastePercent] = useState(35);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'JPY'>('USD');

  const results = useMemo(() => {
    const vpaSavings = Math.round(computeBill * 1000 * 0.259 * 12);
    const hpaSavings = Math.round(computeBill * 1000 * 0.075 * 12);
    const vpaHpaTotal = vpaSavings + hpaSavings;
    const gitOpsSavings = teamSize * 30 * 12 * hourlyRate;
    const alertSavings = Math.round(computeBill * 1000 * 0.05 * 0.12);
    const totalSavings = vpaHpaTotal + gitOpsSavings + alertSavings;
    const sreCost = hourlyRate * 160;
    const netValue = totalSavings - sreCost;
    const roi = (totalSavings / sreCost).toFixed(1);
    const paybackWeeks = Math.round((sreCost / (totalSavings / 52)) * 10) / 10;

    return {
      vpaHpaTotal,
      gitOpsSavings,
      alertSavings,
      totalSavings,
      sreCost,
      netValue,
      roi,
      paybackWeeks,
    };
  }, [clusters, computeBill, teamSize, hourlyRate, wastePercent]);

  const formatCurrency = (val: number) => {
    const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '\u20AC' : '\u00A5';
    if (val >= 1000) return `${sym}${(val / 1000).toFixed(0)}K`;
    return `${sym}${val}`;
  };

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <span className="font-mono-label ml-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          cost-impact-calculator
        </span>
        <span className="ml-auto text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          interactive &middot; industry benchmarks
        </span>
      </div>

      {/* Currency Toggle */}
      <div className="flex gap-2 mb-6">
        {(['USD', 'EUR', 'JPY'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className="px-3 py-1 text-[11px] rounded-md transition-all duration-200"
            style={{
              background: currency === c ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: currency === c ? '#E8E8EC' : 'rgba(255,255,255,0.35)',
              border: '1px solid',
              borderColor: currency === c ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: 'Clusters', value: clusters, min: 50, max: 500, step: 10, unit: '' },
          { label: 'Monthly Compute Bill', value: computeBill, min: 10, max: 200, step: 5, unit: 'K' },
          { label: 'SRE Team Size', value: teamSize, min: 1, max: 10, step: 1, unit: ' engineers' },
          { label: 'SRE Hourly Rate', value: hourlyRate, min: 50, max: 200, step: 5, unit: '/hr' },
        ].map((slider) => (
          <div key={slider.label}>
            <div className="flex justify-between mb-2">
              <span className="text-[11px] font-mono-label" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {slider.label}
              </span>
              <span className="text-[12px] font-medium" style={{ color: '#E8E8EC' }}>
                {slider.unit === 'K' ? `$${slider.value}K` : slider.value + slider.unit}
              </span>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={slider.value}
              onChange={(e) => {
                const setters: Record<string, (v: number) => void> = {
                  'Clusters': setClusters,
                  'Monthly Compute Bill': setComputeBill,
                  'SRE Team Size': setTeamSize,
                  'SRE Hourly Rate': setHourlyRate,
                };
                setters[slider.label]?.(Number(e.target.value));
              }}
            />
          </div>
        ))}
      </div>

      {/* Waste indicator */}
      <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              EST. RESOURCE WASTE
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              mid fleet &middot; CAST AI: 99.94% over-provisioned &middot; Datadog 2024: 83% idle
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-[24px] gradient-text">{wastePercent}%</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>auto-calculated</p>
          </div>
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[11px] font-mono-label mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
            VPA/HPA Implementation
          </p>
          <p className="text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            VPA 25.9% + HPA 7.5% of bill &middot; {clusters} clusters
          </p>
          <p className="text-[18px] font-medium" style={{ color: '#4ade80' }}>
            +{formatCurrency(results.vpaHpaTotal)}/yr
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[11px] font-mono-label mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
            GitOps Automation
          </p>
          <p className="text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {teamSize} SREs &times; 30 hrs/release &times; 12 &middot; {clusters} clusters
          </p>
          <p className="text-[18px] font-medium" style={{ color: '#4ade80' }}>
            +{formatCurrency(results.gitOpsSavings)}/yr
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-[11px] font-mono-label mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Alerts / Runbooks / Auto-Remediation
          </p>
          <p className="text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            5% auto-resolved/mo &middot; 35 min &middot; {clusters} clusters
          </p>
          <p className="text-[18px] font-medium" style={{ color: '#4ade80' }}>
            +{formatCurrency(results.alertSavings)}/yr
          </p>
        </div>
      </div>

      {/* Total Savings */}
      <div className="p-6 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              PROJECTED ANNUAL SAVINGS
            </p>
            <p className="font-display text-[36px] md:text-[48px] gradient-text">
              {formatCurrency(results.totalSavings)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              vs. 1 SRE-month investment ({formatCurrency(results.sreCost)})
            </p>
            <p className="text-[14px] font-medium" style={{ color: '#4ade80' }}>
              payback in ~{results.paybackWeeks} weeks
            </p>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              CAST AI &middot; Datadog &middot; Kubecost benchmarks
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ROI Business Case Component
function ROIBusinessCase() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono-label" style={{ color: '#7c6f64' }}>// why hire alaric?</span>
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>the business case</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Year-1 Financial Model */}
        <div>
          <p className="text-[11px] font-mono-label mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            YEAR-1 FINANCIAL MODEL
          </p>
          <div className="space-y-3">
            {[
              { label: 'Projected savings', value: '$250K', color: '#4ade80' },
              { label: 'Senior SRE cost (~$100/hr)', value: '-$160K', color: '#ef4444' },
              { label: 'Net Year-1 value', value: '+$90K', color: '#4ade80' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                <span className="text-[14px] font-medium" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>ROI</p>
              <p className="font-display text-[28px] gradient-text">1.6&times;</p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[11px] font-mono-label mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>self-funds in</p>
              <p className="font-display text-[28px] gradient-text">~33wk</p>
            </div>
          </div>
        </div>

        {/* What you actually buy */}
        <div>
          <p className="text-[11px] font-mono-label mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            WHAT YOU ACTUALLY BUY
          </p>
          <ul className="space-y-3">
            {[
              '10+ years SRE/platform across AWS, GCP & Kubernetes (EKS/AKS) at scale',
              'GitOps adoption \u2014 production apps under ArgoCD from day one',
              'Golden paths & internal platform tooling: onboarding cut from days to hours',
              'Blue-green/canary rollouts, SLOs, error budgets, on-call runbooks included',
              '60\u201375% MTTR reduction and 50%+ fewer Sev-2 incidents \u2014 proven track record',
              'Savings compound year over year \u2014 no extra headcount required',
            ].map((item, i) => (
              <li key={i} className="text-[13px] flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="https://www.linkedin.com/in/acaacx/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-[13px] font-medium rounded-full transition-all duration-300"
            style={{ background: '#E8E8EC', color: '#030305' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E8EC'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="font-display italic text-[16px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          "Don't hire an SRE to react to incidents. Hire one to build the systems that prevent them
          \u2014 and fund their own salary while doing it."
        </p>
      </div>
    </GlassCard>
  );
}

// CI Pipeline Component
function CIPipeline() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    { num: 1, cmd: 'actions/checkout@v4', status: 'done' },
    { num: 2, cmd: 'setup-node@v4 (node 20)', status: 'done' },
    { num: 3, cmd: 'npm ci', status: 'done' },
    { num: 4, cmd: 'npm run lint', status: 'done' },
    { num: 5, cmd: 'tsc --noEmit', status: 'done' },
    { num: 6, cmd: 'npm run build', status: 'done' },
  ];

  const handleRun = () => {
    setIsRunning(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 6) {
        clearInterval(interval);
        setTimeout(() => setIsRunning(false), 500);
      }
    }, 300);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[13px] font-medium text-[#E8E8EC]">ci-pipeline.yml</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>github-actions &middot; push &rarr; main</p>
        </div>
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>ubuntu-latest &middot; free tier</span>
      </div>

      <div className="space-y-1 mb-4 font-mono text-[12px]">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-3 py-1"
            style={{
              opacity: isRunning ? (step.num <= progress ? 1 : 0.3) : 1,
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>{step.num}</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>&middot;</span>
            <span style={{ color: step.num === 1 || step.num === 2 ? 'rgba(255,255,255,0.5)' : step.num <= progress && isRunning ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>
              {step.cmd}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-4 py-2 text-[12px] rounded-md transition-all duration-200"
          style={{
            background: isRunning ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
            color: '#E8E8EC',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {isRunning ? 'Running...' : 'Run Pipeline'}
        </button>
        <a
          href="https://github.com/acaacx/profile/blob/master/.github/workflows/deploy.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}
        >
          view deploy.yml &nearr;
        </a>
      </div>
    </GlassCard>
  );
}

// Kubectl Terminal Component
function KubectlTerminal() {
  const [activeTab, setActiveTab] = useState<'pods' | 'hpa' | 'svc' | 'events'>('pods');
  const [pods, setPods] = useState([
    { name: 'web-app-0', status: 'Running', cpu: 53, uptime: '2h22m' },
    { name: 'web-app-1', status: 'Running', cpu: 45, uptime: '1h28m' },
    { name: 'web-app-2', status: 'Running', cpu: 38, uptime: '52m' },
    { name: 'metrics-0', status: 'Running', cpu: 14, uptime: '20h15m' },
  ]);

  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'pods', label: 'pods' },
    { key: 'hpa', label: 'hpa' },
    { key: 'svc', label: 'svc' },
    { key: 'events', label: 'events' },
  ];

  const handleKillPod = () => {
    if (pods.length > 1) {
      setPods(pods.slice(0, -1));
    }
  };

  const handleScaleUp = () => {
    const newIndex = pods.length;
    setPods([...pods, {
      name: `web-app-${newIndex}`,
      status: 'Running',
      cpu: Math.floor(Math.random() * 60) + 10,
      uptime: '0m',
    }]);
  };

  const handleScaleDown = () => {
    if (pods.length > 1) {
      setPods(pods.slice(0, -1));
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[13px] font-medium text-[#E8E8EC]">kubectl get all</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>kubernetes &middot; ns/default</p>
        </div>
        <span className="text-[12px] font-medium" style={{ color: '#4ade80' }}>
          {pods.length}/{pods.length} Running
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-3 py-1 text-[11px] rounded-md transition-all duration-200"
            style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeTab === tab.key ? '#E8E8EC' : 'rgba(255,255,255,0.35)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pod List */}
      {activeTab === 'pods' && (
        <div className="space-y-2 mb-4">
          {pods.map((pod) => (
            <div
              key={pod.name}
              className="flex items-center gap-3 py-2 px-3 rounded-md"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#4ade80' }} />
              <span className="text-[12px] font-mono text-[#E8E8EC] flex-1">{pod.name}</span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{pod.status}</span>
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{pod.cpu}m CPU</span>
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{pod.uptime}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab !== 'pods' && (
        <div className="py-8 text-center">
          <p className="text-[12px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            No {activeTab} resources found in namespace default
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleKillPod}
          className="px-3 py-1.5 text-[11px] rounded-md transition-all duration-200"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          Kill Pod
        </button>
        <button
          onClick={handleScaleUp}
          className="px-3 py-1.5 text-[11px] rounded-md transition-all duration-200"
          style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
        >
          + Scale Up
        </button>
        <button
          onClick={handleScaleDown}
          className="px-3 py-1.5 text-[11px] rounded-md transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          &minus; Scale Down
        </button>
      </div>
    </GlassCard>
  );
}

// Golden Signals Dashboard Component
function GoldenSignalsDashboard() {
  const metrics = [
    { label: 'Traffic', sublabel: 'Request Rate', value: '1,876', status: 'warning' as const, statusColor: '#fbbf24' },
    { label: 'Errors', sublabel: 'Error Rate', value: '5.00%', status: 'critical' as const, statusColor: '#ef4444' },
    { label: 'Latency', sublabel: 'P99 Latency', value: '486ms', status: 'critical' as const, statusColor: '#ef4444' },
    { label: 'Saturation', sublabel: 'CPU Saturation', value: '50%', status: 'healthy' as const, statusColor: '#4ade80' },
  ];

  // Simple sparkline SVG path
  const sparklinePath = 'M0,20 L10,18 L20,22 L30,15 L40,19 L50,12 L60,16 L70,10 L80,14 L90,8 L100,12';

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[13px] font-medium text-[#E8E8EC]">golden-signals</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>prometheus &middot; grafana &middot; cluster: production</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={metric.label}
            className="p-4 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[11px] font-mono-label" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {metric.label}
                </p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {metric.sublabel}
                </p>
              </div>
              <div
                className="w-2 h-2 rounded-full status-dot-pulse"
                style={{
                  background: metric.statusColor,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            </div>

            {/* Sparkline */}
            <svg viewBox="0 0 100 30" className="w-full h-[30px] mb-2" preserveAspectRatio="none">
              <path
                d={sparklinePath}
                fill="none"
                stroke={metric.statusColor}
                strokeWidth="1.5"
                opacity="0.5"
              />
            </svg>

            <p className="font-display text-[24px]" style={{ color: '#E8E8EC' }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] mt-4 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
        synthetic data &middot; real Prometheus patterns &middot; 4 SRE golden signals (Latency &middot; Traffic &middot; Errors &middot; Saturation)
      </p>
    </GlassCard>
  );
}

// Main Lab Section
export default function LabSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const container = el.querySelector('.lab-container');
    const cards = el.querySelectorAll('.lab-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    if (container) {
      tl.from(container, { scale: 0.98, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0);
    }

    tl.from(cards, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    }, 0.3);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="lab"
      ref={sectionRef}
      className="relative z-10 py-[80px] md:py-[120px]"
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionLabel text="$ ls ~/sandbox/" accent />
        <p className="text-[12px] mb-8" style={{ color: 'rgba(255,255,255,0.25)' }}>
          live SRE demos &middot; running in your browser &middot; no backend
        </p>

        <div
          className="lab-container p-4 md:p-8 rounded-2xl"
          style={{
            background: 'rgba(10,10,14,0.7)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="space-y-6">
            <div className="lab-card">
              <CostCalculator />
            </div>
            <div className="lab-card">
              <ROIBusinessCase />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="lab-card">
                <CIPipeline />
              </div>
              <div className="lab-card">
                <KubectlTerminal />
              </div>
            </div>
            <div className="lab-card">
              <GoldenSignalsDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
