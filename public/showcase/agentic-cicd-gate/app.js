// Global App State
const state = {
  isRunning: false,
  currentStepIndex: 0,
  speedMultiplier: 2,
  scenario: 'pass', // 'pass', 'fail', or 'dynamic'
  threshold: 85,
  agentQuality: 90,
  currentSlide: 1,
  animationTimers: [],
  logs: []
};

// UI Elements
const el = {
  btnTrigger: document.getElementById('btn-trigger'),
  btnReset: document.getElementById('btn-reset'),
  scenarioSelect: document.getElementById('scenario-select'),
  thresholdSlider: document.getElementById('threshold-slider'),
  thresholdVal: document.getElementById('threshold-val'),
  agentSliderGroup: document.getElementById('agent-performance-group'),
  agentSlider: document.getElementById('agent-score-slider'),
  agentScoreVal: document.getElementById('agent-score-val'),
  speedSelect: document.getElementById('speed-select'),
  pipelineStatus: document.getElementById('pipeline-status'),
  statusText: document.querySelector('#pipeline-status .status-text'),
  progressFill: document.getElementById('pipeline-progress-fill'),
  progressText: document.getElementById('progress-text'),
  terminalOutput: document.getElementById('terminal-output'),
  btnClearConsole: document.getElementById('btn-clear-console'),
  
  // Stats
  statScenarioIndex: document.getElementById('current-scenario-index'),
  statTrajectoryScore: document.getElementById('current-trajectory-score'),
  statRougeScore: document.getElementById('current-rouge-score'),
  
  // Slides
  slideNum: document.getElementById('current-slide-num'),
  slidePrev: document.getElementById('slide-prev'),
  slideNext: document.getElementById('slide-next-btn'),
  btnDemoSlide: document.getElementById('btn-demo-slide'),
  
  // SVG items
  svg: document.querySelector('.sequence-svg'),
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

// Initialize SVG Line Lengths for dynamic transitions
const initSvgLines = () => {
  const lines = document.querySelectorAll('.msg-line');
  lines.forEach(line => {
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
  });
};

// Set values on load
document.addEventListener('DOMContentLoaded', () => {
  initSvgLines();
  updateScenarioState();
  setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
  el.btnTrigger.addEventListener('click', startPipeline);
  el.btnReset.addEventListener('click', resetPipeline);
  
  el.scenarioSelect.addEventListener('change', (e) => {
    state.scenario = e.target.value;
    updateScenarioState();
  });
  
  el.thresholdSlider.addEventListener('input', (e) => {
    state.threshold = parseInt(e.target.value);
    el.thresholdVal.textContent = state.threshold + '%';
    updateScenarioState();
  });

  el.agentSlider.addEventListener('input', (e) => {
    state.agentQuality = parseInt(e.target.value);
    el.agentScoreVal.textContent = state.agentQuality + '%';
    updateScenarioState();
  });
  
  el.speedSelect.addEventListener('change', (e) => {
    state.speedMultiplier = parseFloat(e.target.value);
  });
  
  el.btnClearConsole.addEventListener('click', () => {
    // Keep baseline commands
    el.terminalOutput.innerHTML = `
      <div class="terminal-line system-msg"># Console cleared.</div>
      <div class="terminal-line cursor-line"><span class="prompt">$</span><span class="cursor">_</span></div>
    `;
  });
}

// Show/Hide Agent Slider based on chosen scenario
function updateScenarioState() {
  if (state.scenario === 'dynamic') {
    el.agentSliderGroup.style.opacity = '1';
    el.agentSliderGroup.style.pointerEvents = 'auto';
  } else {
    el.agentSliderGroup.style.opacity = '0.5';
    el.agentSliderGroup.style.pointerEvents = 'none';
  }
}

// Slide control logic
function changeSlide(direction) {
  const newSlide = state.currentSlide + direction;
  if (newSlide >= 1 && newSlide <= 5) {
    document.getElementById(`slide-${state.currentSlide}`).classList.remove('active');
    state.currentSlide = newSlide;
    document.getElementById(`slide-${state.currentSlide}`).classList.add('active');
    
    el.slideNum.textContent = state.currentSlide;
    el.slidePrev.disabled = state.currentSlide === 1;
    el.slideNext.disabled = state.currentSlide === 5;
    
    // Update Demo Button Text based on Slide Context
    const slideDemoTexts = {
      1: "🚀 Simulate Git Push",
      2: "🛠️ Trigger Build & Environment Setup",
      3: "🏃 Load Evaluator & Start Golden Dataset",
      4: "📊 Run Evaluations & Compare Trajectories",
      5: "🏁 Complete Automated Decision Gate"
    };
    el.btnDemoSlide.textContent = slideDemoTexts[state.currentSlide];
  }
}

// Terminal line writer helper
function writeLog(text, type = 'info', isCommand = false) {
  const line = document.createElement('div');
  line.className = `terminal-line log-${type}`;
  
  if (isCommand) {
    line.innerHTML = `<span class="prompt">$</span><span class="cmd-text">${text}</span>`;
  } else {
    line.textContent = text;
  }
  
  // Insert before cursor line
  const cursorLine = el.terminalOutput.querySelector('.cursor-line');
  el.terminalOutput.insertBefore(line, cursorLine);
  el.terminalOutput.scrollTop = el.terminalOutput.scrollHeight;
}

// Highlighting current actor
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

// Reset diagram states
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
    step.className = 'gate-step'; // clears active/passed/failed
  });
  
  el.altBlock.className = 'alt-block-group';
  highlightActors([]);
}

// Core Timeline Engine
function sleep(ms) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms / state.speedMultiplier);
    state.animationTimers.push(timer);
  });
}

// Determine if pipeline passes based on settings
function checkPassOutcome() {
  if (state.scenario === 'pass') return true;
  if (state.scenario === 'fail') return false;
  return state.agentQuality >= state.threshold;
}

// Reset pipeline
function resetPipeline() {
  state.isRunning = false;
  document.body.classList.remove('state-running');
  el.btnTrigger.disabled = false;
  el.btnReset.disabled = true;
  
  // Clear Timers
  state.animationTimers.forEach(clearTimeout);
  state.animationTimers = [];
  
  // Clean values
  el.pipelineStatus.className = 'pipeline-status';
  el.statusText.textContent = 'PIPELINE: IDLE';
  el.progressFill.style.width = '0%';
  el.progressText.textContent = '0 / 10 Scenarios';
  
  el.statScenarioIndex.textContent = '-';
  el.statTrajectoryScore.textContent = '-';
  el.statRougeScore.textContent = '-';
  
  resetVisuals();
  writeLog('Pipeline reset. Standby.', 'system');
}

// Start continuous simulation
async function startPipeline() {
  if (state.isRunning) return;
  state.isRunning = true;
  document.body.classList.add('state-running');
  el.btnTrigger.disabled = true;
  el.btnReset.disabled = false;
  
  el.pipelineStatus.className = 'pipeline-status running';
  el.statusText.textContent = 'PIPELINE: RUNNING';
  
  resetVisuals();
  
  try {
    // 1. Git Push / Deploy
    highlightActors(['developer', 'github']);
    el.msgGitPush.classList.add('active');
    const pushLine = el.msgGitPush.querySelector('.msg-line');
    pushLine.classList.add('animate-msg');
    
    writeLog('git push origin main', 'main', true);
    await sleep(400);
    writeLog('Enumerating objects: 7, done.', 'info');
    writeLog('Counting objects: 100% (7/7), done.', 'info');
    writeLog('Writing objects: 100% (4/4), 1.28 KiB, done.', 'info');
    writeLog('To github.com:alaric/autonomous-agent.git', 'info');
    writeLog('   d512a84..f34e891  main -> main', 'info');
    
    await sleep(1000);
    
    // 2. Trigger Build
    highlightActors(['github', 'cirunner']);
    el.msgTriggerBuild.classList.add('active');
    const triggerLine = el.msgTriggerBuild.querySelector('.msg-line');
    triggerLine.classList.add('animate-msg');
    
    writeLog('[webhook] GitHub pushed notification received.', 'info');
    writeLog('[ci-runner] Starting pipeline build #42291', 'info');
    writeLog('[ci-runner] Pulling repository source code...', 'info');
    await sleep(400);
    writeLog('[ci-runner] Provisioning isolated test runner container...', 'info');
    writeLog('[ci-runner] Mounting virtual tools and agent credentials.', 'info');
    
    await sleep(1000);
    
    // 3. Run test_agent_eval.py
    highlightActors(['cirunner', 'evaluator']);
    el.msgRunEval.classList.add('active');
    const runLine = el.msgRunEval.querySelector('.msg-line');
    runLine.classList.add('animate-msg');
    
    writeLog('python3 test_agent_eval.py --dataset=tests/golden_dataset.json', 'main', true);
    writeLog('[evaluator] ADK testing gate initializing...', 'info');
    
    await sleep(1000);
    
    // 4. Automated Gate: Load Code
    el.gateBox.classList.add('active');
    el.gateStepLoad.classList.add('active');
    writeLog('[evaluator] Loading Agent script logic: `src/agents/reasoning.py`', 'info');
    await sleep(400);
    writeLog('[evaluator] Code integrity check: PASSED (sha256 matches)', 'success');
    el.gateStepLoad.classList.remove('active');
    el.gateStepLoad.classList.add('passed');
    
    await sleep(800);
    
    // 5. Automated Gate: Run Golden Dataset
    el.gateStepRun.classList.add('active');
    writeLog('[evaluator] Initializing Golden Dataset benchmarks (10 Scenarios)...', 'info');
    await sleep(400);
    
    const isPass = checkPassOutcome();
    
    // Simulating 10 scenarios
    const baseTargetScore = isPass ? 90 : 70;
    
    for (let i = 1; i <= 10; i++) {
      el.progressText.textContent = `${i} / 10 Scenarios`;
      el.progressFill.style.width = `${i * 10}%`;
      el.statScenarioIndex.textContent = `#${i}`;
      
      // Calculate scores dynamically with some noise
      let scenarioTraj = baseTargetScore + Math.floor(Math.random() * 8) - 4;
      let scenarioRouge = baseTargetScore + Math.floor(Math.random() * 8) - 4;
      
      // Ensure bounds
      scenarioTraj = Math.min(100, Math.max(0, scenarioTraj));
      scenarioRouge = Math.min(100, Math.max(0, scenarioRouge));
      
      // Fail scenarios specifically on Fail path
      if (!isPass && (i === 4 || i === 7 || i === 9)) {
        scenarioTraj = 42 + Math.floor(Math.random() * 10);
        scenarioRouge = 38 + Math.floor(Math.random() * 10);
      }
      
      el.statTrajectoryScore.textContent = `${scenarioTraj}%`;
      el.statRougeScore.textContent = `${scenarioRouge}%`;
      
      const scenarioScore = Math.round((scenarioTraj + scenarioRouge) / 2);
      
      if (scenarioScore >= state.threshold) {
        writeLog(`Scenario ${i}: Task completed. Trajectory: ${scenarioTraj}%, ROUGE: ${scenarioRouge}% -> PASSED`, 'success');
      } else {
        // Log agent failure specific contexts
        let failReason = "Low Score";
        if (i === 4) failReason = "Infinite loop detected (API limit reached)";
        if (i === 7) failReason = "Safety Violation (Attempted root execution)";
        
        writeLog(`Scenario ${i}: Task incomplete. Trajectory: ${scenarioTraj}%, ROUGE: ${scenarioRouge}% -> FAILED (${failReason})`, 'error');
      }
      
      await sleep(400); // quick ticks for scenarios
    }
    
    el.gateStepRun.classList.remove('active');
    el.gateStepRun.classList.add(isPass ? 'passed' : 'failed');
    
    await sleep(800);
    
    // 6. Automated Gate: Compare Trajectory
    el.gateStepCompare.classList.add('active');
    writeLog('[evaluator] Aggregating overall dataset statistics...', 'info');
    await sleep(400);
    
    const finalScore = isPass 
      ? (state.scenario === 'dynamic' ? state.agentQuality : 92)
      : (state.scenario === 'dynamic' ? state.agentQuality : 72);
      
    const finalTraj = finalScore + 2;
    const finalRouge = finalScore - 2;
    
    el.statScenarioIndex.textContent = "ALL";
    el.statTrajectoryScore.textContent = `${finalTraj}%`;
    el.statRougeScore.textContent = `${finalRouge}%`;
    
    writeLog(`[evaluator] Evaluator Results Aggregate:`, 'info');
    writeLog(`  - Average Trajectory overlap: ${finalTraj}%`, 'info');
    writeLog(`  - Average ROUGE-L similarity: ${finalRouge}%`, 'info');
    writeLog(`  - Composite Performance Score: ${finalScore}%`, isPass ? 'success' : 'error');
    writeLog(`  - Required Quality Threshold: ${state.threshold}%`, 'info');
    
    el.gateStepCompare.classList.remove('active');
    el.gateStepCompare.classList.add(isPass ? 'passed' : 'failed');
    
    await sleep(1000);
    
    // 7. Decision ALT node branch
    if (isPass) {
      el.altBlock.classList.add('pass-active');
      el.msgPassedOk.classList.add('active');
      el.msgPassedOk.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[evaluator] Score exceeds threshold. Exiting status: 0 (SUCCESS)', 'success');
      
      await sleep(1200);
      
      highlightActors(['cirunner', 'production']);
      el.msgDeployAgent.classList.add('active');
      el.msgDeployAgent.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[ci-runner] Testing completed. Proceeding to production deploy.', 'info');
      writeLog('[ci-runner] Pushing artifact to container registry...', 'info');
      await sleep(400);
      writeLog('[ci-runner] Running deployment manifest...', 'info');
      writeLog('[ci-runner] Deploy successful! Agent is active in Production cloud.', 'success');
      
      el.pipelineStatus.className = 'pipeline-status passed';
      el.statusText.textContent = 'PIPELINE: PASSED';
    } else {
      el.altBlock.classList.add('fail-active');
      el.msgFailedExit.classList.add('active');
      el.msgFailedExit.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[evaluator] ERROR: Score is BELOW threshold! Exiting status: 1 (FAILURE)', 'error');
      
      await sleep(1200);
      
      highlightActors(['cirunner', 'developer']);
      el.msgBlockDeploy.classList.add('active');
      el.msgBlockDeploy.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[ci-runner] Blocked deploy due to ADK evaluation failure.', 'error');
      writeLog('[ci-runner] Status reported back to repository. Commit check failed.', 'error');
      writeLog('[webhook] Pull Request blocks merged state. Action Required.', 'error');
      
      el.pipelineStatus.className = 'pipeline-status failed';
      el.statusText.textContent = 'PIPELINE: FAILED';
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    state.isRunning = false;
  }
}

// Demo behaviors matching slide content (for manual presentation interaction)
async function demoSlideBehavior() {
  if (state.isRunning) return;
  
  // Clear any existing timer/visual state
  resetVisuals();
  
  const slide = state.currentSlide;
  const isPass = checkPassOutcome();
  
  if (slide === 1) {
    // Git push demonstration
    highlightActors(['developer', 'github']);
    el.msgGitPush.classList.add('active');
    el.msgGitPush.querySelector('.msg-line').classList.add('animate-msg');
    
    writeLog('--- Presentation Triggered: Step 1 (Git Push) ---', 'system');
    writeLog('git push origin main', 'main', true);
    writeLog('Counting objects: 100% (7/7), done.', 'info');
    writeLog('Writing objects: 100% (4/4), 1.28 KiB, done.', 'info');
  } 
  else if (slide === 2) {
    // Trigger Build
    highlightActors(['github', 'cirunner']);
    el.msgTriggerBuild.classList.add('active');
    el.msgTriggerBuild.querySelector('.msg-line').classList.add('animate-msg');
    
    writeLog('--- Presentation Triggered: Step 2 (Trigger Build) ---', 'system');
    writeLog('[webhook] Triggering build #42291', 'info');
    writeLog('[ci-runner] Initializing virtual container environment...', 'info');
  } 
  else if (slide === 3) {
    // Start Evaluator
    highlightActors(['cirunner', 'evaluator']);
    el.msgRunEval.classList.add('active');
    el.msgRunEval.querySelector('.msg-line').classList.add('animate-msg');
    el.gateBox.classList.add('active');
    el.gateStepLoad.classList.add('active');
    
    writeLog('--- Presentation Triggered: Step 3 (Start Evaluator) ---', 'system');
    writeLog('python3 test_agent_eval.py', 'main', true);
    writeLog('[evaluator] Loading agent scripts...', 'info');
  } 
  else if (slide === 4) {
    // Run dataset & compare
    el.gateBox.classList.add('active');
    el.gateStepRun.classList.add('active');
    el.gateStepCompare.classList.add('active');
    
    writeLog('--- Presentation Triggered: Step 4 (Evaluator benchmarks) ---', 'system');
    writeLog('[evaluator] Comparing Agent logs and generated SQL against Golden Trajectories.', 'info');
    
    // Load some mock evaluation stats
    el.statScenarioIndex.textContent = "ALL";
    el.statTrajectoryScore.textContent = isPass ? "91%" : "71%";
    el.statRougeScore.textContent = isPass ? "89%" : "69%";
    el.progressFill.style.width = '100%';
    el.progressText.textContent = '10 / 10 Scenarios';
  } 
  else if (slide === 5) {
    // Gate Decision Alt
    el.gateBox.classList.add('active');
    el.gateStepLoad.classList.add('passed');
    el.gateStepRun.classList.add(isPass ? 'passed' : 'failed');
    el.gateStepCompare.classList.add(isPass ? 'passed' : 'failed');
    
    writeLog('--- Presentation Triggered: Step 5 (Decision Gate) ---', 'system');
    
    if (isPass) {
      el.altBlock.classList.add('pass-active');
      el.msgPassedOk.classList.add('active');
      el.msgPassedOk.querySelector('.msg-line').classList.add('animate-msg');
      
      highlightActors(['cirunner', 'production']);
      el.msgDeployAgent.classList.add('active');
      el.msgDeployAgent.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[evaluator] Score > Threshold. Validation Passed.', 'success');
      writeLog('[ci-runner] Deploying Agent to production cluster.', 'success');
    } else {
      el.altBlock.classList.add('fail-active');
      el.msgFailedExit.classList.add('active');
      el.msgFailedExit.querySelector('.msg-line').classList.add('animate-msg');
      
      highlightActors(['cirunner', 'developer']);
      el.msgBlockDeploy.classList.add('active');
      el.msgBlockDeploy.querySelector('.msg-line').classList.add('animate-msg');
      writeLog('[evaluator] Score < Threshold. Validation Failed.', 'error');
      writeLog('[ci-runner] Aborted deployment. Alert sent to GitHub.', 'error');
    }
  }
}
