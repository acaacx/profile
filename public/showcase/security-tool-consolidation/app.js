// Global App State
const state = {
  isRunning: false,
  speedMultiplier: 2,
  scenario: 'before', // 'before' or 'after'
  animationTimers: []
};

const TOOLS = {
  sca: {
    label: 'SCA / Vulnerability Scanning',
    before: [
      { name: 'Snyk', severity: 'CRITICAL', cls: 'sev-critical' },
      { name: 'Trivy', severity: 'HIGH', cls: 'sev-high' },
      { name: 'Qualys', severity: 'MEDIUM', cls: 'sev-medium' },
      { name: 'WhiteSource', severity: 'HIGH', cls: 'sev-high' },
      { name: 'Anchore', severity: 'CRITICAL', cls: 'sev-critical' },
      { name: 'Twistlock', severity: 'MEDIUM', cls: 'sev-medium' },
    ],
    after: { name: 'Microsoft Defender for Cloud', severity: 'UNIFIED', cls: 'sev-unified' },
  },
  secrets: {
    label: 'Secrets Detection',
    before: [
      { name: 'HashiCorp Vault', severity: 'HIGH', cls: 'sev-high' },
      { name: 'AWS Secrets Manager', severity: 'MEDIUM', cls: 'sev-medium' },
      { name: 'CyberArk', severity: 'CRITICAL', cls: 'sev-critical' },
    ],
    after: { name: 'GitHub Advanced Security', severity: 'UNIFIED', cls: 'sev-unified' },
  },
  logs: {
    label: 'Log Aggregation',
    before: [
      { name: 'Splunk', severity: 'HIGH', cls: 'sev-high' },
      { name: 'ELK Stack', severity: 'MEDIUM', cls: 'sev-medium' },
    ],
    after: { name: 'Azure DevOps (native)', severity: 'UNIFIED', cls: 'sev-unified' },
  },
};

const el = {
  btnTrigger: document.getElementById('btn-trigger'),
  btnReset: document.getElementById('btn-reset'),
  scenarioSelect: document.getElementById('scenario-select'),
  speedSelect: document.getElementById('speed-select'),
  pipelineStatus: document.getElementById('pipeline-status'),
  statusText: document.querySelector('#pipeline-status .status-text'),
  progressFill: document.getElementById('pipeline-progress-fill'),
  progressText: document.getElementById('progress-text'),
  terminalOutput: document.getElementById('terminal-output'),
  btnClearConsole: document.getElementById('btn-clear-console'),

  statScenarioIndex: document.getElementById('current-scenario-index'),
  statTrajectoryScore: document.getElementById('current-trajectory-score'),
  statRougeScore: document.getElementById('current-rouge-score'),

  countSca: document.getElementById('count-sca'),
  countSecrets: document.getElementById('count-secrets'),
  countLogs: document.getElementById('count-logs'),

  gridSca: document.getElementById('grid-sca'),
  gridSecrets: document.getElementById('grid-secrets'),
  gridLogs: document.getElementById('grid-logs'),
};

const GRIDS = { sca: el.gridSca, secrets: el.gridSecrets, logs: el.gridLogs };
const COUNTS = { sca: el.countSca, secrets: el.countSecrets, logs: el.countLogs };

function renderBefore() {
  Object.keys(TOOLS).forEach((key) => {
    const grid = GRIDS[key];
    grid.innerHTML = '';
    TOOLS[key].before.forEach((tool) => {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.innerHTML = `<span class="tool-card-name">${tool.name}</span><span class="tool-card-severity ${tool.cls}">${tool.severity}</span>`;
      grid.appendChild(card);
    });
    COUNTS[key].textContent = `${TOOLS[key].before.length} tools`;
  });
}

function renderAfter() {
  Object.keys(TOOLS).forEach((key) => {
    const grid = GRIDS[key];
    grid.innerHTML = '';
    const tool = TOOLS[key].after;
    const card = document.createElement('div');
    card.className = 'tool-card tool-consolidated';
    card.innerHTML = `<span class="tool-card-name">${tool.name}</span><span class="tool-card-severity ${tool.cls}">${tool.severity}</span>`;
    grid.appendChild(card);
    COUNTS[key].textContent = '1 tool';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBefore();
  setupEventListeners();
});

function setupEventListeners() {
  el.btnTrigger.addEventListener('click', runAudit);
  el.btnReset.addEventListener('click', resetAudit);

  el.scenarioSelect.addEventListener('change', (e) => {
    state.scenario = e.target.value;
  });

  el.speedSelect.addEventListener('change', (e) => {
    state.speedMultiplier = parseFloat(e.target.value);
  });

  el.btnClearConsole.addEventListener('click', () => {
    el.terminalOutput.innerHTML = `
      <div class="terminal-line system-msg"># Console cleared.</div>
      <div class="terminal-line cursor-line"><span class="prompt">$</span><span class="cursor">_</span></div>
    `;
  });
}

function writeLog(text, type = 'info', isCommand = false) {
  const line = document.createElement('div');
  line.className = `terminal-line log-${type}`;

  if (isCommand) {
    line.innerHTML = `<span class="prompt">$</span><span class="cmd-text">${text}</span>`;
  } else {
    line.textContent = text;
  }

  const cursorLine = el.terminalOutput.querySelector('.cursor-line');
  el.terminalOutput.insertBefore(line, cursorLine);
  el.terminalOutput.scrollTop = el.terminalOutput.scrollHeight;
}

function sleep(ms) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms / state.speedMultiplier);
    state.animationTimers.push(timer);
  });
}

function resetAudit() {
  state.isRunning = false;
  document.body.classList.remove('state-running');
  el.btnTrigger.disabled = false;
  el.btnReset.disabled = true;

  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];

  renderBefore();
  el.pipelineStatus.className = 'pipeline-status failed';
  el.statusText.textContent = 'STATE: FRAGMENTED';
  el.statScenarioIndex.textContent = '11';
  el.statTrajectoryScore.textContent = '3';
  el.statRougeScore.textContent = '0';
  el.progressText.textContent = '0 / 11 Tools Reviewed';
  el.progressFill.style.width = '0%';

  writeLog('Audit reset. Stack restored to fragmented baseline.', 'system');
}

async function runAudit() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.classList.add('state-running');
  el.btnTrigger.disabled = true;
  el.btnReset.disabled = false;

  const goingToAfter = state.scenario === 'after';

  el.pipelineStatus.className = 'pipeline-status running';
  el.statusText.textContent = 'AUDITING STACK...';

  try {
    if (!goingToAfter) {
      renderBefore();
      writeLog('grep -r "severity" ./scan-reports/*.json', 'main', true);
      await sleep(400);

      let reviewed = 0;
      const allTools = [...TOOLS.sca.before, ...TOOLS.secrets.before, ...TOOLS.logs.before];
      for (const tool of allTools) {
        reviewed++;
        el.progressText.textContent = `${reviewed} / 11 Tools Reviewed`;
        el.progressFill.style.width = `${(reviewed / 11) * 100}%`;
        writeLog(`[audit] ${tool.name} flags CVE-2024-41xx as ${tool.severity}`, 'warn');
        await sleep(250);
      }

      writeLog('[audit] 3 disagreeing severity verdicts for the same finding. No single source of truth.', 'error');
      writeLog('[audit] Redundant secret stores and duplicate log pipelines add licensing overhead with no added coverage.', 'error');

      el.statScenarioIndex.textContent = '11';
      el.statTrajectoryScore.textContent = '3';
      el.statRougeScore.textContent = '0';
      el.pipelineStatus.className = 'pipeline-status failed';
      el.statusText.textContent = 'STATE: FRAGMENTED';
    } else {
      writeLog('Mapping each tool to its real detection coverage...', 'main', true);
      await sleep(600);

      const allBefore = [
        ...Array.from(GRIDS.sca.children).map((c, i) => ({ el: c, name: TOOLS.sca.before[i].name })),
        ...Array.from(GRIDS.secrets.children).map((c, i) => ({ el: c, name: TOOLS.secrets.before[i].name })),
        ...Array.from(GRIDS.logs.children).map((c, i) => ({ el: c, name: TOOLS.logs.before[i].name })),
      ];

      let decommissioned = 0;
      for (const item of allBefore) {
        item.el.classList.add('tool-removed');
        decommissioned++;
        el.progressText.textContent = `${decommissioned} / 11 Tools Decommissioned`;
        el.progressFill.style.width = `${(decommissioned / 11) * 100}%`;
        writeLog(`[migrate] Decommissioning ${item.name} — coverage absorbed by native platform.`, 'info');
        await sleep(220);
      }

      await sleep(500);
      writeLog('[migrate] Enabling Microsoft Defender for Cloud (SCA + vulnerability management)...', 'info');
      await sleep(300);
      writeLog('[migrate] Enabling GitHub Advanced Security (secret scanning)...', 'info');
      await sleep(300);
      writeLog('[migrate] Enabling Azure DevOps native pipeline logging...', 'info');
      await sleep(500);

      renderAfter();
      writeLog('[migrate] Consolidation complete. 3 third-party vendor contracts terminated.', 'success');
      writeLog('[migrate] Severity verdicts unified: one coverage model, one source of truth.', 'success');

      el.statScenarioIndex.textContent = '3';
      el.statTrajectoryScore.textContent = '1';
      el.statRougeScore.textContent = '3';
      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'STATE: CONSOLIDATED';
    }
  } catch (err) {
    console.error(err);
  } finally {
    state.isRunning = false;
    document.body.classList.remove('state-running');
    el.btnTrigger.disabled = false;
  }
}
