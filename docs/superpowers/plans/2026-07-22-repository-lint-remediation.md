# Repository Lint Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repository-wide ESLint command complete with zero errors and zero warnings without changing product behavior.

**Architecture:** Treat `npm run lint` as the failing regression command. Apply behavior-preserving source fixes for immutable bindings and hook dependencies, replace impure render-time randomness with a deterministic `useId`-based value, and scope the Fast Refresh export exception only to generated UI-library modules.

**Tech Stack:** TypeScript, React 19, ESLint 9 flat config, React Hooks ESLint plugin, Vite Fast Refresh, Vitest

---

## File Map

- Modify `eslint.config.js`: add a UI-directory-only Fast Refresh export exception.
- Modify `src/components/WebGPUCanvas.tsx`: use immutable bindings where no rebinding occurs.
- Modify `src/components/ui/sidebar.tsx`: derive skeleton width purely from `useId`.
- Modify `src/hooks/useScrollAnimation.ts`: align effect dependencies with option primitives.
- Modify `src/sections/LabSection.tsx`: remove memo dependencies not read by the calculation.

### Task 1: Fix Mechanical Errors and Scope the UI Export Rule

**Files:**
- Modify: `eslint.config.js`
- Modify: `src/components/WebGPUCanvas.tsx`

- [ ] **Step 1: Confirm the failing lint baseline**

Run: `npm run lint`

Expected: FAIL with 11 errors and 2 warnings, including three `prefer-const` errors and seven `react-refresh/only-export-components` errors.

- [ ] **Step 2: Make the GPU bindings immutable**

Change only the declarations; do not alter the referenced GPU objects:

```ts
const cellStateA = device.createTexture({
  size: [GRID_SIZE, GRID_SIZE],
  format: 'rgba8unorm',
  usage: textureUsage,
});

const cellStateB = device.createTexture({
  size: [GRID_SIZE, GRID_SIZE],
  format: 'rgba8unorm',
  usage: textureUsage,
});

const bindGroups = createBindGroups(cellStateA, cellStateB);
```

- [ ] **Step 3: Add the narrow generated-UI override**

Append this block after the general TypeScript configuration in `eslint.config.js`:

```js
{
  files: ['src/components/ui/**/*.{ts,tsx}'],
  rules: {
    'react-refresh/only-export-components': 'off',
  },
},
```

- [ ] **Step 4: Verify this failure group is removed**

Run: `npx eslint eslint.config.js src/components/WebGPUCanvas.tsx src/components/ui`

Expected: only the `SidebarMenuSkeleton` render-purity error remains.

### Task 2: Make Sidebar Skeleton Rendering Pure

**Files:**
- Modify: `src/components/ui/sidebar.tsx`

- [ ] **Step 1: Replace render-time randomness with stable variation**

Use React's stable ID as a pure seed:

```tsx
const skeletonId = React.useId()
const width = React.useMemo(() => {
  const seed = Array.from(skeletonId).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  )

  return `${50 + (seed % 40)}%`
}, [skeletonId])
```

Keep the existing CSS variable and the 50–89% width range unchanged.

- [ ] **Step 2: Verify the UI directory lints cleanly**

Run: `npx eslint src/components/ui`

Expected: PASS with no errors or warnings.

### Task 3: Correct Hook Dependency Contracts

**Files:**
- Modify: `src/hooks/useScrollAnimation.ts`
- Modify: `src/sections/LabSection.tsx`

- [ ] **Step 1: Destructure animation options before the effect**

Move the defaults above `useEffect`:

```ts
const {
  y = 40,
  x = 0,
  scale,
  opacity = 0,
  duration = 0.7,
  stagger = 0.1,
  ease = 'power2.out',
  start = 'top 80%',
  delay = 0,
} = options;
```

Remove the duplicate destructuring inside the effect and use this dependency list:

```ts
}, [delay, duration, ease, opacity, scale, stagger, start, x, y]);
```

- [ ] **Step 2: Remove unread cost-result dependencies**

Change the memo dependency list without altering its calculation:

```ts
}, [computeBill, teamSize, hourlyRate]);
```

- [ ] **Step 3: Verify both hook files lint cleanly**

Run: `npx eslint src/hooks/useScrollAnimation.ts src/sections/LabSection.tsx`

Expected: PASS with no errors or warnings.

### Task 4: Verify, Commit, and Push

**Files:**
- Review: `eslint.config.js`
- Review: `src/components/WebGPUCanvas.tsx`
- Review: `src/components/ui/sidebar.tsx`
- Review: `src/hooks/useScrollAnimation.ts`
- Review: `src/sections/LabSection.tsx`
- Review: `docs/superpowers/specs/2026-07-22-repository-lint-remediation-design.md`
- Review: `docs/superpowers/plans/2026-07-22-repository-lint-remediation.md`

- [ ] **Step 1: Run the full verification sequence**

Run: `npm run lint && npm test && npm run build`

Expected: ESLint reports no problems, all tests pass, and Vite produces the production bundle.

- [ ] **Step 2: Review the exact diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors and only the planned files are modified.

- [ ] **Step 3: Commit the implementation**

Run:

```bash
git add eslint.config.js src/components/WebGPUCanvas.tsx src/components/ui/sidebar.tsx src/hooks/useScrollAnimation.ts src/sections/LabSection.tsx docs/superpowers/plans/2026-07-22-repository-lint-remediation.md
git commit -m "fix: resolve repository lint errors"
```

Expected: the commit succeeds with only the planned files.

- [ ] **Step 4: Push main**

Run: `git push origin main`

Expected: the design and implementation commits are published to `origin/main`.
