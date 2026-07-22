// Global App State
const state = {
  isRunning: false,
  speedMultiplier: 2,
  scenario: 'pass', // 'pass', 'fail', 'exception', or 'dynamic'
  cvss: 2.5,
  animationTimers: []
};

// UI Elements
const el = {
  btnTrigger: document.getElementById('btn-trigger'),
  btnReset: document.getElementById('btn-reset'),
  scenarioSelect: document.getElementById('scenario-select'),
  cvssGroup: document.getElementById('cvss-group'),
  cvssSlider: document.getElementById('cvss-slider'),
  cvssVal: document.getElementById('cvss-val'),
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

  actors: document.querySelectorAll('.actor-col'),
  msgGitPush: document.getElementById('msg-git-push'),
  msgTriggerBuild: document.getElementById('msg-trigger-build'),
  msgRunEval: document.getElementById('msg-run-eval'),
  gateBox: document.getElementById('gate-box-group'),
  gateStepLoad: document.getElementById('gate-step-load'),
  gateStepRun: document.getElementById('gate-step-run'),
  gateStepCompare: document.getElementById('gate-step-compare'),
  altBlock: document.getElementById('alt-block-group'),
  msgFailedExit: document.getElementById('msg-failed-exit'),
  msgBlockDeploy: document.getElementById('msg-block-deploy'),
  msgExceptionGranted: document.getElementById('msg-exception-granted'),
  msgDeployException: document.getElementById('msg-deploy-exception'),
  msgPassedOk: document.getElementById('msg-passed-ok'),
  msgDeployAgent: document.getElementById('msg-deploy-agent'),
};

const initSvgLines = () => {
  const lines = document.querySelectorAll('.msg-line');
  lines.forEach(line => {
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initSvgLines();
  updateScenarioState();
  setupEventListeners();
});

function setupEventListeners() {
  el.btnTrigger.addEventListener('click', startPipeline);
  el.btnReset.addEventListener('click', resetPipeline);

  el.scenarioSelect.addEventListener('change', (e) => {
    state.scenario = e.target.value;
    updateScenarioState();
  });

  el.cvssSlider.addEventListener('input', (e) => {
    state.cvss = parseFloat(e.target.value);
    el.cvssVal.textContent = state.cvss.toFixed(1);
    updateScenarioState();
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

function updateScenarioState() {
  if (state.scenario === 'dynamic') {
    el.cvssGroup.style.opacity = '1';
    el.cvssGroup.style.pointerEvents = 'auto';
  } else {
    el.cvssGroup.style.opacity = '0.5';
    el.cvssGroup.style.pointerEvents = 'none';
  }
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

function highlightActors(actorNames = []) {
  el.actors.forEach(actor => {
    const name = actor.getAttribute('data-actor');
    if (actorNames.includes(name)) {
      actor.classList.add('highlighted');
    } else {
      actor.classList.remove('highlighted');
    }
  });
}

function resetVisuals() {
  document.querySelectorAll('.msg-group, .alt-msg').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelectorAll('.msg-line').forEach(line => {
    line.classList.remove('animate-msg');
    const len = line.getTotalLength();
    line.style.strokeDashoffset = len;
  });

  el.gateBox.classList.remove('active');
  document.querySelectorAll('.gate-step').forEach(step => {
    step.className = 'gate-step';
  });

  el.altBlock.className = 'alt-block-group';
  highlightActors([]);
}

function sleep(ms) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms / state.speedMultiplier);
    state.animationTimers.push(timer);
  });
}

// Returns 'pass' | 'exception' | 'fail'
function checkOutcome() {
  if (state.scenario === 'pass') return 'pass';
  if (state.scenario === 'fail') return 'fail';
  if (state.scenario === 'exception') return 'exception';
  if (state.cvss >= 7.0) return 'fail';
  if (state.cvss >= 4.0) return 'exception';
  return 'pass';
}

function resetPipeline() {
  state.isRunning = false;
  document.body.classList.remove('state-running');
  el.btnTrigger.disabled = false;
  el.btnReset.disabled = true;

  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];

  el.pipelineStatus.className = 'pipeline-status';
  el.statusText.textContent = 'PIPELINE: IDLE';
  el.progressFill.style.width = '0%';
  el.progressText.textContent = '0 / 3 Checks';

  el.statScenarioIndex.textContent = '-';
  el.statTrajectoryScore.textContent = '-';
  el.statRougeScore.textContent = '-';

  resetVisuals();
  writeLog('Pipeline reset. Standby.', 'system');
}

async function startPipeline() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.classList.add('state-running');
  el.btnTrigger.disabled = true;
  el.btnReset.disabled = false;

  el.pipelineStatus.className = 'pipeline-status running';
  el.statusText.textContent = 'PIPELINE: RUNNING';

  resetVisuals();

  const outcome = checkOutcome();
  const cvss = state.scenario === 'dynamic' ? state.cvss
    : outcome === 'fail' ? 8.6
    : outcome === 'exception' ? 5.4
    : 1.8;

  try {
    // 1. Push / open PR
    highlightActors(['developer', 'github']);
    el.msgGitPush.classList.add('active');
    el.msgGitPush.querySelector('.msg-line').classList.add('animate-msg');

    writeLog('git push origin feature/checkout-service', 'main', true);
    await sleep(400);
    writeLog('Enumerating objects: 11, done.', 'info');
    writeLog('To github.com:acaacx/checkout-service.git', 'info');
    writeLog('   a1c3f0e..b7d24aa  feature/checkout-service -> feature/checkout-service', 'info');

    await sleep(1000);

    // 2. Trigger build
    highlightActors(['github', 'cirunner']);
    el.msgTriggerBuild.classList.add('active');
    el.msgTriggerBuild.querySelector('.msg-line').classList.add('animate-msg');

    writeLog('[github] Pull request opened. Checks required: policy-gate', 'info');
    writeLog('[ci-runner] Building container image ghcr.io/acaacx/checkout-service:b7d24aa', 'info');
    await sleep(400);
    writeLog('[ci-runner] cosign sign --key cosign.key ghcr.io/acaacx/checkout-service:b7d24aa', 'info');
    writeLog('[ci-runner] syft packages ghcr.io/acaacx/checkout-service:b7d24aa -o spdx-json > sbom.json', 'info');

    await sleep(1000);

    // 3. Invoke gate
    highlightActors(['cirunner', 'evaluator']);
    el.msgRunEval.classList.add('active');
    el.msgRunEval.querySelector('.msg-line').classList.add('animate-msg');

    writeLog('conftest test --policy opa/ image-attestation.json', 'main', true);
    writeLog('[gatekeeper] Admission policy evaluation starting...', 'info');

    await sleep(1000);

    // 4. Verify signature
    el.gateBox.classList.add('active');
    el.gateStepLoad.classList.add('active');
    writeLog('[opa] cosign verify ghcr.io/acaacx/checkout-service:b7d24aa', 'info');
    await sleep(400);
    writeLog('[opa] Signature valid (keyless, Rekor transparency log entry #4471203)', 'success');
    el.gateStepLoad.classList.remove('active');
    el.gateStepLoad.classList.add('passed');
    el.progressText.textContent = '1 / 3 Checks';
    el.progressFill.style.width = '33%';

    await sleep(800);

    // 5. Verify SBOM
    el.gateStepRun.classList.add('active');
    writeLog('[opa] Checking SBOM attestation is present and attached...', 'info');
    await sleep(400);
    writeLog('[opa] SBOM found: 214 packages, SPDX 2.3 format', 'success');
    el.gateStepRun.classList.remove('active');
    el.gateStepRun.classList.add('passed');
    el.progressText.textContent = '2 / 3 Checks';
    el.progressFill.style.width = '66%';

    await sleep(800);

    // 6. Evaluate CVE severity
    el.gateStepCompare.classList.add('active');
    writeLog('[opa] Scanning SBOM against NVD feed for known CVEs...', 'info');
    await sleep(600);

    el.statScenarioIndex.textContent = 'OK';
    el.statTrajectoryScore.textContent = cvss.toFixed(1);

    if (outcome === 'fail') {
      writeLog(`[opa] CVE-2025-41221 found in libssl3 -- CVSS ${cvss.toFixed(1)} (CRITICAL)`, 'error');
      writeLog(`[opa] Policy violation: critical-severity CVE (threshold: 7.0). deny[msg]`, 'error');
      el.gateStepCompare.classList.remove('active');
      el.gateStepCompare.classList.add('failed');
      el.statRougeScore.textContent = 'BLOCKED';
    } else if (outcome === 'exception') {
      writeLog(`[opa] CVE-2024-33891 found in requests -- CVSS ${cvss.toFixed(1)} (MEDIUM)`, 'warn');
      writeLog(`[opa] Policy: medium-severity CVE below hard-block threshold. Exception path engaged.`, 'info');
      el.gateStepCompare.classList.remove('active');
      el.gateStepCompare.classList.add('passed');
      const ticket = `RISK-${1000 + Math.floor(Math.random() * 8999)}`;
      el.statRougeScore.textContent = ticket;
    } else {
      writeLog(`[opa] No CVEs above CVSS ${cvss.toFixed(1)} found. Clean scan.`, 'success');
      el.gateStepCompare.classList.remove('active');
      el.gateStepCompare.classList.add('passed');
      el.statRougeScore.textContent = '—';
    }

    await sleep(1000);

    // 7. Decision
    if (outcome === 'fail') {
      el.altBlock.classList.add('fail-active');
      el.msgFailedExit.classList.add('active');
      el.msgFailedExit.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[opa] Admission denied. Exiting status: 1 (FAILURE)', 'error');

      await sleep(1200);

      highlightActors(['cirunner', 'developer']);
      el.msgBlockDeploy.classList.add('active');
      el.msgBlockDeploy.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[ci-runner] Deploy blocked. Critical CVE must be remediated before merge.', 'error');
      writeLog('[github] Required check "policy-gate" failed. Merge blocked.', 'error');

      el.pipelineStatus.className = 'pipeline-status failed';
      el.statusText.textContent = 'PIPELINE: BLOCKED';
    } else if (outcome === 'exception') {
      el.altBlock.classList.add('exception-active');
      el.msgExceptionGranted.classList.add('active');
      el.msgExceptionGranted.querySelector('.msg-line').classList.add('animate-msg');
      const ticket = el.statRougeScore.textContent;
      writeLog(`[opa] Medium severity within tolerance. Risk-acceptance ticket ${ticket} opened (auto-expires in 30 days).`, 'warn');

      await sleep(1200);

      highlightActors(['cirunner', 'production']);
      el.msgDeployException.classList.add('active');
      el.msgDeployException.querySelector('.msg-line').classList.add('animate-msg');
      writeLog(`[ci-runner] Proceeding to production with linked exception ${ticket}.`, 'info');
      writeLog('[ci-runner] Deploy successful. Risk owner notified via Jira.', 'success');

      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'PIPELINE: EXCEPTION';
    } else {
      el.altBlock.classList.add('pass-active');
      el.msgPassedOk.classList.add('active');
      el.msgPassedOk.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[opa] All policies satisfied. Exiting status: 0 (SUCCESS)', 'success');

      await sleep(1200);

      highlightActors(['cirunner', 'production']);
      el.msgDeployAgent.classList.add('active');
      el.msgDeployAgent.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[ci-runner] Pushing signed artifact to production registry...', 'info');
      writeLog('[ci-runner] Deploy successful. checkout-service is live.', 'success');

      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'PIPELINE: PASSED';
    }

  } catch (err) {
    console.error(err);
  } finally {
    state.isRunning = false;
  }
}
