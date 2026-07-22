// Global App State
const state = {
  isRunning: false,
  speedMultiplier: 2,
  scenario: 'oidc', // 'oidc' or 'legacy'
  rotationDays: 12,
  animationTimers: []
};

// UI Elements
const el = {
  btnTrigger: document.getElementById('btn-trigger'),
  btnReset: document.getElementById('btn-reset'),
  scenarioSelect: document.getElementById('scenario-select'),
  rotationGroup: document.getElementById('rotation-group'),
  rotationSlider: document.getElementById('rotation-slider'),
  rotationVal: document.getElementById('rotation-val'),
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

  el.rotationSlider.addEventListener('input', (e) => {
    state.rotationDays = parseInt(e.target.value);
    el.rotationVal.textContent = state.rotationDays;
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
  const isLegacy = state.scenario === 'legacy';
  el.rotationGroup.style.opacity = isLegacy ? '1' : '0.5';
  el.rotationGroup.style.pointerEvents = isLegacy ? 'auto' : 'none';

  if (!state.isRunning) {
    el.pipelineStatus.className = isLegacy ? 'pipeline-status failed' : 'pipeline-status passed';
    el.statusText.textContent = isLegacy ? 'RISK: HIGH (STANDING SECRET)' : 'RISK: NONE (OIDC)';
    el.statScenarioIndex.textContent = isLegacy ? 'Client Secret' : 'OIDC';
    el.statTrajectoryScore.textContent = isLegacy ? '90 days' : '1hr';
    el.statRougeScore.textContent = isLegacy ? 'Contributor' : 'RG-only';
    if (isLegacy) {
      const remaining = Math.max(0, 90 - state.rotationDays);
      el.progressText.textContent = `${remaining} days until forced rotation`;
      el.progressFill.style.width = `${(state.rotationDays / 90) * 100}%`;
    } else {
      el.progressText.textContent = 'N/A — no standing secret';
      el.progressFill.style.width = '0%';
    }
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

function resetPipeline() {
  state.isRunning = false;
  document.body.classList.remove('state-running');
  el.btnTrigger.disabled = false;
  el.btnReset.disabled = true;

  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];

  resetVisuals();
  updateScenarioState();
  writeLog('Deploy job reset. Standby.', 'system');
}

async function startPipeline() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.classList.add('state-running');
  el.btnTrigger.disabled = true;
  el.btnReset.disabled = false;

  const isLegacy = state.scenario === 'legacy';

  el.pipelineStatus.className = 'pipeline-status running';
  el.statusText.textContent = 'AUTHENTICATING...';

  resetVisuals();

  try {
    // 1. Git push
    highlightActors(['developer', 'github']);
    el.msgGitPush.classList.add('active');
    el.msgGitPush.querySelector('.msg-line').classList.add('animate-msg');

    writeLog('git push origin main', 'main', true);
    await sleep(400);
    writeLog('[github] Workflow "deploy-aks.yml" triggered on push to main', 'info');

    await sleep(1000);

    // 2. Request credential
    highlightActors(['github', 'entra']);
    el.msgTriggerBuild.classList.add('active');
    el.msgTriggerBuild.querySelector('.msg-line').classList.add('animate-msg');

    if (isLegacy) {
      writeLog('[actions] az login --service-principal -u $ARM_CLIENT_ID -p $ARM_CLIENT_SECRET', 'main', true);
      writeLog('[actions] Reading ARM_CLIENT_SECRET from GitHub Secrets store...', 'info');
    } else {
      writeLog('[actions] Requesting OIDC ID token from GitHub Actions token endpoint...', 'main', true);
      writeLog('[actions] id_token audience=api://AzureADTokenExchange issued (aud, sub, iss claims)', 'info');
    }

    await sleep(1000);

    // 3. Validate & authorize
    highlightActors(['entra', 'arm']);
    el.msgRunEval.classList.add('active');
    el.msgRunEval.querySelector('.msg-line').classList.add('animate-msg');

    if (isLegacy) {
      writeLog('[entra-id] Authenticating service principal via client_credentials grant...', 'info');
    } else {
      writeLog('[entra-id] Validating federated credential subject against app registration...', 'info');
      writeLog('[entra-id] Issuer matches trusted GitHub OIDC issuer. Exchanging for Azure AD token.', 'info');
    }

    await sleep(1000);

    // 4. Validate credential
    el.gateBox.classList.add('active');
    el.gateStepLoad.classList.add('active');
    await sleep(400);
    writeLog(isLegacy ? '[entra-id] Client secret verified against stored hash.' : '[entra-id] OIDC token signature verified (JWKS).', 'success');
    el.gateStepLoad.classList.remove('active');
    el.gateStepLoad.classList.add('passed');

    await sleep(800);

    // 5. Resolve RBAC scope
    el.gateStepRun.classList.add('active');
    writeLog('[arm] Resolving role assignment for principal...', 'info');
    await sleep(400);
    if (isLegacy) {
      writeLog('[arm] Role assignment: Contributor @ subscription scope', 'error');
    } else {
      writeLog('[arm] Role assignment: custom-deploy-role @ resource-group "rg-checkout-prod"', 'success');
    }
    el.gateStepRun.classList.remove('active');
    el.gateStepRun.classList.add(isLegacy ? 'failed' : 'passed');

    await sleep(800);

    // 6. Issue token
    el.gateStepCompare.classList.add('active');
    writeLog('[entra-id] Minting access token...', 'info');
    await sleep(400);

    el.statScenarioIndex.textContent = isLegacy ? 'Client Secret' : 'OIDC';
    el.statTrajectoryScore.textContent = isLegacy ? '90 days' : '1hr';
    el.statRougeScore.textContent = isLegacy ? 'Contributor' : 'RG-only';

    if (isLegacy) {
      writeLog(`[entra-id] Token issued. Scope: subscription-wide. TTL: 90 days (standing secret).`, 'error');
    } else {
      writeLog(`[entra-id] Token issued. Scope: rg-checkout-prod only. TTL: 1 hour.`, 'success');
    }
    el.gateStepCompare.classList.remove('active');
    el.gateStepCompare.classList.add(isLegacy ? 'failed' : 'passed');

    await sleep(1000);

    // 7. Decision branch
    if (isLegacy) {
      el.altBlock.classList.add('fail-active');
      el.msgFailedExit.classList.add('active');
      el.msgFailedExit.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[audit] Standing credential in use. Sign-in not distinguishable from manual admin login.', 'error');

      await sleep(1200);

      highlightActors(['entra', 'aks']);
      el.msgBlockDeploy.classList.add('active');
      el.msgBlockDeploy.querySelector('.msg-line').classList.add('animate-msg');
      const remaining = Math.max(0, 90 - state.rotationDays);
      writeLog(`[ops] Secret rotation due in ${remaining} days. Manual rotation ticket required.`, 'error');
      writeLog('[ops] Deploy proceeded — but risk surface remains until secret is rotated.', 'error');

      el.pipelineStatus.className = 'pipeline-status failed';
      el.statusText.textContent = 'RISK: HIGH (STANDING SECRET)';
      el.progressText.textContent = `${remaining} days until forced rotation`;
      el.progressFill.style.width = `${(state.rotationDays / 90) * 100}%`;
    } else {
      el.altBlock.classList.add('pass-active');
      el.msgPassedOk.classList.add('active');
      el.msgPassedOk.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[audit] Sign-in logged in Entra ID with workflow run ID, repo, and commit SHA as claims.', 'success');

      await sleep(1200);

      highlightActors(['arm', 'aks']);
      el.msgDeployAgent.classList.add('active');
      el.msgDeployAgent.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[actions] Deploying to AKS + reading secrets from Key Vault using scoped token...', 'info');
      writeLog('[actions] Deploy successful. Token expires automatically in 1 hour.', 'success');

      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'RISK: NONE (OIDC)';
      el.progressText.textContent = 'N/A — no standing secret';
      el.progressFill.style.width = '0%';
    }

  } catch (err) {
    console.error(err);
  } finally {
    state.isRunning = false;
  }
}
