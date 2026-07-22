// Global App State
const state = {
  isRunning: false,
  speedMultiplier: 2,
  scenario: 'tuned', // 'tuned' or 'default'
  animationTimers: [],
  eventsSeen: 0,
  alertsFired: 0,
};

const CURATED = ['auth-spike', 'crash-loop', 'keyvault-access'];

const EVENTS = [
  { id: 'autoscale', icon: '📈', name: 'Routine autoscale: web-app 3 -> 5 replicas', curated: false },
  { id: 'pod-restart', icon: '🔄', name: 'Individual pod restart: checkout-7f9d', curated: false },
  { id: 'latency', icon: '⏱️', name: 'Non-critical dependency latency: +40ms on geo-lookup', curated: false },
  { id: 'auth-spike', icon: '🔐', name: 'Authentication failure spike: 340 failed logins/5min', curated: true },
  { id: 'backup', icon: '💾', name: 'Nightly backup job completed successfully', curated: false },
  { id: 'crash-loop', icon: '💥', name: 'Pod crash-loop detected: payments-api restarting x6', curated: true },
  { id: 'cert', icon: '📜', name: 'TLS certificate renewed: api.internal.example.com', curated: false },
  { id: 'dns', icon: '🌐', name: 'DNS TTL cache refresh completed', curated: false },
  { id: 'keyvault-access', icon: '🔑', name: 'Anomalous Key Vault access: unfamiliar principal, 2AM UTC', curated: true },
  { id: 'rollout', icon: '🚀', name: 'Deployment rollout complete: v2.14.0', curated: false },
  { id: 'disk', icon: '🗄️', name: 'Disk usage nominal: 61% on node-pool-2', curated: false },
  { id: 'cpu', icon: '⚙️', name: 'CPU spike auto-resolved by HPA in 90s', curated: false },
  { id: 'node-heal', icon: '🩹', name: 'Node self-healed after kubelet restart', curated: false },
  { id: 'image-pull', icon: '📦', name: 'Image pull retry succeeded after transient registry error', curated: false },
];

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
  eventFeed: document.getElementById('event-feed'),

  statScenarioIndex: document.getElementById('current-scenario-index'),
  statTrajectoryScore: document.getElementById('current-trajectory-score'),
  statRougeScore: document.getElementById('current-rouge-score'),
};

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

function setupEventListeners() {
  el.btnTrigger.addEventListener('click', streamTelemetry);
  el.btnReset.addEventListener('click', resetDemo);

  el.scenarioSelect.addEventListener('change', (e) => {
    state.scenario = e.target.value;
    if (!state.isRunning) {
      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = state.scenario === 'tuned' ? 'MODE: TUNED (3 ALERTS)' : 'MODE: DEFAULT (ALL ALERT)';
    }
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

function addEventRow(event, isAlert) {
  const row = document.createElement('div');
  row.className = `event-row${isAlert ? ' is-alert' : ''}`;
  row.innerHTML = `
    <span class="event-icon">${event.icon}</span>
    <span class="event-name">${event.name}</span>
    <span class="event-badge ${isAlert ? 'badge-alert' : 'badge-suppressed'}">${isAlert ? 'Alert Fired' : 'Logged, No Page'}</span>
  `;
  el.eventFeed.appendChild(row);
  el.eventFeed.scrollTop = el.eventFeed.scrollHeight;
}

function resetDemo() {
  state.isRunning = false;
  document.body.classList.remove('state-running');
  el.btnTrigger.disabled = false;
  el.btnReset.disabled = true;

  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];
  state.eventsSeen = 0;
  state.alertsFired = 0;

  el.eventFeed.innerHTML = `
    <div class="event-row">
      <span class="event-icon">📡</span>
      <span class="event-name">Telemetry stream idle. Click "Stream Telemetry" to begin.</span>
    </div>
  `;

  el.statScenarioIndex.textContent = '0';
  el.statTrajectoryScore.textContent = '0';
  el.statRougeScore.textContent = '—';
  el.progressText.textContent = '0%';
  el.progressFill.style.width = '0%';
  el.progressFill.className = 'progress-fill fatigue-low';

  el.pipelineStatus.className = 'pipeline-status passed';
  el.statusText.textContent = state.scenario === 'tuned' ? 'MODE: TUNED (3 ALERTS)' : 'MODE: DEFAULT (ALL ALERT)';

  writeLog('Stream reset. Standby.', 'system');
}

async function streamTelemetry() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.classList.add('state-running');
  el.btnTrigger.disabled = true;
  el.btnReset.disabled = false;

  const isTuned = state.scenario === 'tuned';
  el.eventFeed.innerHTML = '';
  state.eventsSeen = 0;
  state.alertsFired = 0;

  el.pipelineStatus.className = 'pipeline-status running';
  el.statusText.textContent = 'STREAMING TELEMETRY...';

  if (isTuned) {
    writeLog('.create-or-alter rule AuthFailureSpike | CrashLoopDetect | KeyVaultAnomalousAccess', 'main', true);
    writeLog('[monitor] 3 curated KQL alert rules active. All other signals logged only.', 'info');
  } else {
    writeLog('[monitor] Default alerting policy: every anomaly signal pages on-call.', 'info');
  }
  await sleep(500);

  try {
    for (const event of EVENTS) {
      const isAlert = isTuned ? event.curated : true;

      state.eventsSeen++;
      if (isAlert) state.alertsFired++;

      addEventRow(event, isAlert);

      if (isAlert) {
        writeLog(`[alert] ${event.name} -> PagerDuty notification sent`, 'error');
      } else {
        writeLog(`[monitor] ${event.name} -> logged to Log Analytics, no alert rule matched`, 'info');
      }

      el.statScenarioIndex.textContent = String(state.eventsSeen);
      el.statTrajectoryScore.textContent = String(state.alertsFired);
      el.statRougeScore.textContent = `${state.alertsFired}/${state.eventsSeen}`;

      const fatigue = Math.min(100, Math.round((state.alertsFired / EVENTS.length) * 100));
      el.progressText.textContent = `${fatigue}%`;
      el.progressFill.style.width = `${fatigue}%`;
      el.progressFill.className = `progress-fill ${isTuned ? 'fatigue-low' : 'fatigue-high'}`;

      await sleep(350);
    }

    await sleep(500);

    if (isTuned) {
      writeLog(`[monitor] Stream complete: ${state.alertsFired} alert(s) out of ${state.eventsSeen} events. Every page was worth acting on.`, 'success');
      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'MODE: TUNED (3 ALERTS)';
    } else {
      writeLog(`[monitor] Stream complete: ${state.alertsFired} alert(s) out of ${state.eventsSeen} events. On-call is now trained to ignore pages.`, 'error');
      el.pipelineStatus.className = 'pipeline-status failed';
      el.statusText.textContent = 'MODE: DEFAULT (ALERT FATIGUE)';
    }
  } catch (err) {
    console.error(err);
  } finally {
    state.isRunning = false;
    document.body.classList.remove('state-running');
    el.btnTrigger.disabled = false;
  }
}
