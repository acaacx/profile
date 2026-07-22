// Global App State
const state = {
  isRunning: false,
  speedMultiplier: 2,
  scenario: 'before', // 'before' or 'after'
  animationTimers: [],
};

const FILE_BEFORE = `<div class="code-line"><span class="code-key">database</span>:</div>
<div class="code-line">  <span class="code-key">host</span>: db.internal.example.com</div>
<div class="code-line line-secret-plain">  <span class="code-key">password</span>: "Sup3rS3cr3t!2024"</div>
<div class="code-line"><span class="code-key">api</span>:</div>
<div class="code-line line-secret-plain">  <span class="code-key">stripe_key</span>: "stripe-key-REDACTED-FOR-DEMO-000000"</div>`;

const FILE_AFTER = `<div class="code-line"><span class="code-key">database</span>:</div>
<div class="code-line">  <span class="code-key">host</span>: db.internal.example.com</div>
<div class="code-line line-secret-vault">  <span class="code-key">password</span>: "@Microsoft.KeyVault(SecretUri=https://kv-prod.vault.azure.net/secrets/db-password/)"</div>
<div class="code-line"><span class="code-key">api</span>:</div>
<div class="code-line line-secret-vault">  <span class="code-key">stripe_key</span>: "@Microsoft.KeyVault(SecretUri=https://kv-prod.vault.azure.net/secrets/stripe-key/)"</div>`;

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
  fileBody: document.getElementById('file-body'),
  fileModeLabel: document.getElementById('file-mode-label'),
  fileFooter: document.getElementById('file-footer'),

  statScenarioIndex: document.getElementById('current-scenario-index'),
  statTrajectoryScore: document.getElementById('current-trajectory-score'),
  statRougeScore: document.getElementById('current-rouge-score'),
};

document.addEventListener('DOMContentLoaded', () => {
  updateFileView();
  setupEventListeners();
});

function setupEventListeners() {
  el.btnTrigger.addEventListener('click', attemptCommit);
  el.btnReset.addEventListener('click', resetDemo);

  el.scenarioSelect.addEventListener('change', (e) => {
    state.scenario = e.target.value;
    if (!state.isRunning) updateFileView();
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

function updateFileView() {
  const isAfter = state.scenario === 'after';
  el.fileBody.innerHTML = isAfter ? FILE_AFTER : FILE_BEFORE;
  el.fileModeLabel.textContent = isAfter ? 'Key Vault references' : 'plaintext secrets';
  el.fileFooter.textContent = isAfter
    ? 'secret values resolved at runtime by Key Vault — never stored in the repo'
    : 'committed directly to source control · no scanning in place';

  if (!state.isRunning) {
    el.statScenarioIndex.textContent = isAfter ? '0' : '2';
    el.statTrajectoryScore.textContent = isAfter ? '0' : 'N/A';
    el.statRougeScore.textContent = isAfter ? 'Pre-commit + CI' : 'None';
    el.pipelineStatus.className = isAfter ? 'pipeline-status passed' : 'pipeline-status failed';
    el.statusText.textContent = isAfter ? 'SECRETS IN SOURCE: 0' : 'SECRETS IN SOURCE: 2';
    el.progressText.textContent = isAfter ? '2 / 2 Secrets Migrated' : '0 / 2 Secrets Migrated';
    el.progressFill.style.width = isAfter ? '100%' : '0%';
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

function sleep(ms) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms / state.speedMultiplier);
    state.animationTimers.push(timer);
  });
}

function resetDemo() {
  state.isRunning = false;
  document.body.classList.remove('state-running');
  el.btnTrigger.disabled = false;
  el.btnReset.disabled = true;

  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];

  updateFileView();
  writeLog('Reset. Standby.', 'system');
}

async function attemptCommit() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.classList.add('state-running');
  el.btnTrigger.disabled = true;
  el.btnReset.disabled = false;

  const isAfter = state.scenario === 'after';

  el.pipelineStatus.className = 'pipeline-status running';
  el.statusText.textContent = 'COMMITTING...';

  try {
    if (!isAfter) {
      writeLog('git add config.yaml', 'main', true);
      await sleep(300);
      writeLog('git commit -m "add db and stripe config"', 'main', true);
      await sleep(400);
      writeLog('[git] No pre-commit hooks configured.', 'info');
      writeLog('[git] Commit created: a1c3f0e', 'success');
      await sleep(400);
      writeLog('git push origin main', 'main', true);
      await sleep(400);
      writeLog('[github] No secret scanning gate on this pipeline.', 'error');
      writeLog('[github] Push accepted. Plaintext secrets are now in git history, permanently.', 'error');

      el.statScenarioIndex.textContent = '2';
      el.statTrajectoryScore.textContent = 'N/A';
      el.statRougeScore.textContent = 'None';
      el.progressText.textContent = '0 / 2 Secrets Migrated';
      el.progressFill.style.width = '0%';
      el.pipelineStatus.className = 'pipeline-status failed';
      el.statusText.textContent = 'SECRETS IN SOURCE: 2';
    } else {
      // Stage 1: accidental regression attempt with plaintext secret
      writeLog('git add config.yaml', 'main', true);
      await sleep(300);
      writeLog('git commit -m "quick fix: hardcode stripe key for testing"', 'main', true);
      await sleep(400);
      writeLog('[gitleaks] pre-commit hook running...', 'info');
      await sleep(500);
      writeLog('[gitleaks] Finding: generic-api-key in config.yaml:5 (stripe_key)', 'error');
      writeLog('[gitleaks] Commit rejected. 1 leak(s) found.', 'error');

      await sleep(800);

      writeLog('[dev] Reverting to Key Vault reference instead...', 'info');
      await sleep(400);

      // Stage 2: proper commit with Key Vault reference
      writeLog('git add config.yaml', 'main', true);
      await sleep(300);
      writeLog('git commit -m "migrate secrets to Key Vault references"', 'main', true);
      await sleep(400);
      writeLog('[gitleaks] pre-commit hook running...', 'info');
      await sleep(500);
      writeLog('[gitleaks] No leaks found. Commit allowed.', 'success');
      writeLog('[git] Commit created: b7d24aa', 'success');
      await sleep(400);
      writeLog('git push origin main', 'main', true);
      await sleep(400);
      writeLog('[ci] Pipeline-level Gitleaks scan running (non-bypassable)...', 'info');
      await sleep(500);
      writeLog('[ci] Scan clean. 0 secrets in source.', 'success');
      writeLog('[ci] Deploy proceeds. Secret values resolved at runtime from Key Vault.', 'success');

      el.statScenarioIndex.textContent = '0';
      el.statTrajectoryScore.textContent = '1';
      el.statRougeScore.textContent = 'Pre-commit + CI';
      el.progressText.textContent = '2 / 2 Secrets Migrated';
      el.progressFill.style.width = '100%';
      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'SECRETS IN SOURCE: 0';
    }
  } catch (err) {
    console.error(err);
  } finally {
    state.isRunning = false;
    document.body.classList.remove('state-running');
    el.btnTrigger.disabled = false;
  }
}
