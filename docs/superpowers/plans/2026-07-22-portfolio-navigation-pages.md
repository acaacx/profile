# Portfolio Navigation and Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add route-aware desktop and mobile navigation, move the interactive showcase to `/interactive`, and publish the supplied CI/CD diagram as the first entry on `/designs`.

**Architecture:** Wrap the existing global shell in `BrowserRouter`, compose three focused page components, and centralize link resolution in a small navigation module. Keep the existing `LabSection` intact and relocate it through composition. Implement the diagram viewer with the existing Radix Dialog primitive so focus trapping, Escape handling, and focus return are provided by a tested accessibility foundation.

**Tech Stack:** React 19, TypeScript, React Router 7, Tailwind CSS, Radix Dialog, Lucide React, GSAP, Vitest, Testing Library

---

## File Map

- Create `src/lib/navigation.ts`: navigation definitions and route-aware href resolution.
- Create `src/lib/navigation.test.ts`: unit coverage for link order and href resolution.
- Create `src/pages/HomePage.tsx`: homepage section composition without `LabSection`.
- Create `src/pages/InteractivePage.tsx`: dedicated route introduction and existing showcase.
- Create `src/pages/DesignsPage.tsx`: real one-entry design gallery and accessible enlarged view.
- Create `src/pages/NotFoundPage.tsx`: safe unknown-route fallback.
- Create `src/test/setup.ts`: DOM test setup.
- Create `src/components/Navigation.test.tsx`: route and mobile-menu interaction coverage.
- Create `src/pages/DesignsPage.test.tsx`: gallery image and dialog coverage.
- Create `public/images/designs/cicd-pipeline-architecture.png`: imported supplied source asset.
- Modify `src/App.tsx`: shared shell and route definitions.
- Modify `src/components/Navigation.tsx`: route-aware links, active states, and mobile menu.
- Modify `src/components/Footer.tsx`: route-safe homepage links.
- Modify `src/index.css`: focus, active-link, hash-offset, reduced-motion, and page-shell styles.
- Modify `vite.config.ts`: Vitest jsdom configuration.
- Modify `package.json` and `package-lock.json`: test scripts and test-only dependencies.
- Modify `.gitignore`: ignore the visual-companion working directory.

### Task 1: Add Test Harness and Navigation Contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/navigation.test.ts`
- Create: `src/lib/navigation.ts`

- [ ] **Step 1: Install the test dependencies**

Run: `npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`

Expected: dependencies are recorded in `package.json` and `package-lock.json`.

- [ ] **Step 2: Add the test script and jsdom setup**

Add `"test": "vitest run"` to `scripts`. Configure Vite with:

```ts
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Write the failing navigation contract test**

```ts
import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, getNavigationHref } from './navigation';

describe('navigation contract', () => {
  it('keeps the approved journey order', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'About', 'Experience', 'Projects', 'Interactive', 'Designs', 'Contact',
    ]);
  });

  it('uses local hashes on home and home hashes on interior routes', () => {
    expect(getNavigationHref('/', NAV_ITEMS[0])).toBe('#about');
    expect(getNavigationHref('/interactive', NAV_ITEMS[0])).toBe('/#about');
    expect(getNavigationHref('/', NAV_ITEMS[3])).toBe('/interactive');
  });
});
```

- [ ] **Step 4: Run the test and verify failure**

Run: `npm test -- src/lib/navigation.test.ts`

Expected: FAIL because `src/lib/navigation.ts` does not exist.

- [ ] **Step 5: Implement the navigation contract**

```ts
export type NavItem =
  | { label: string; kind: 'section'; target: string }
  | { label: string; kind: 'route'; target: string };

export const NAV_ITEMS: NavItem[] = [
  { label: 'About', kind: 'section', target: 'about' },
  { label: 'Experience', kind: 'section', target: 'experience' },
  { label: 'Projects', kind: 'section', target: 'projects' },
  { label: 'Interactive', kind: 'route', target: '/interactive' },
  { label: 'Designs', kind: 'route', target: '/designs' },
  { label: 'Contact', kind: 'section', target: 'contact' },
];

export function getNavigationHref(pathname: string, item: NavItem) {
  if (item.kind === 'route') return item.target;
  return pathname === '/' ? `#${item.target}` : `/#${item.target}`;
}
```

- [ ] **Step 6: Run the navigation test**

Run: `npm test -- src/lib/navigation.test.ts`

Expected: PASS.

### Task 2: Add Route Pages and Move the Showcase

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/InteractivePage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create focused page compositions**

`HomePage` renders `HeroSection`, `AboutSection`, `ExperienceSection`, `ProjectsSection`, and `ContactSection` in that order. `InteractivePage` renders an `h1`, a short introduction, and `LabSection`. `NotFoundPage` renders an `h1`, explanation, and `Link to="/"`.

- [ ] **Step 2: Replace the one-page App composition with routes**

```tsx
<BrowserRouter>
  <WebGPUCanvas />
  <Navigation />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/interactive" element={<InteractivePage />} />
    <Route path="/designs" element={<DesignsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
  <Footer />
</BrowserRouter>
```

- [ ] **Step 3: Build and confirm the route composition compiles**

Run: `npm run build`

Expected: PASS with Vite output in `dist/`.

### Task 3: Make Navigation Route-Aware and Mobile-Accessible

**Files:**
- Create: `src/components/Navigation.test.tsx`
- Modify: `src/components/Navigation.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Write failing component tests**

Render `Navigation` inside `MemoryRouter` and assert the approved six-link order, `Interactive` active state on `/interactive`, the mobile menu's `aria-expanded` transition, and menu closure after selecting a route.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- src/components/Navigation.test.tsx`

Expected: FAIL because the existing component still exposes Sandbox and has no mobile menu.

- [ ] **Step 3: Implement desktop, mobile, and hash behavior**

Use `useLocation`, `useNavigate`, `Menu`, and `X`. Resolve hrefs with `getNavigationHref`; smooth-scroll local homepage section links; navigate interior-page section links to `/#section`; expose a labelled mobile button with `aria-expanded`; close the panel after link activation. Use `aria-current="page"` for active route links and `aria-current="location"` for active sections.

- [ ] **Step 4: Add visible interaction styles**

Add `.nav-link`, `.nav-link-active`, `:focus-visible`, `[id] { scroll-margin-top: 88px; }`, and reduced-motion overrides. Use a non-color underline cue for active links and preserve the existing dark palette.

- [ ] **Step 5: Make footer section links route-safe**

Replace direct DOM-only scrolling with links targeting `/#about`, `/#experience`, `/#projects`, and `/#contact` so the footer works from all pages.

- [ ] **Step 6: Run navigation tests**

Run: `npm test -- src/components/Navigation.test.tsx`

Expected: PASS.

### Task 4: Add the CI/CD Design Gallery Entry

**Files:**
- Create: `public/images/designs/cicd-pipeline-architecture.png`
- Create: `src/pages/DesignsPage.test.tsx`
- Create: `src/pages/DesignsPage.tsx`

- [ ] **Step 1: Import the supplied asset**

Copy `/Users/alaric/Downloads/BasicCICD.png` to `public/images/designs/cicd-pipeline-architecture.png` without re-encoding it. Verify both files have the same SHA-256 digest.

- [ ] **Step 2: Write the failing gallery test**

Assert that the page renders the `Designs` heading, the `CI/CD Pipeline Architecture` entry, the image with descriptive alt text, and a dialog containing the full-size image after activation.

- [ ] **Step 3: Run the test and verify failure**

Run: `npm test -- src/pages/DesignsPage.test.tsx`

Expected: FAIL because `DesignsPage` does not exist.

- [ ] **Step 4: Implement the gallery and enlarged view**

Use the existing Radix-backed `Dialog` components. Render the image with `object-contain`, its native aspect ratio, a descriptive caption, and a visible `View full size` action. The dialog uses `DialogTitle`, `DialogDescription`, and a labelled close control.

- [ ] **Step 5: Run gallery tests**

Run: `npm test -- src/pages/DesignsPage.test.tsx`

Expected: PASS.

### Task 5: Verify, Review, Commit, and Push

**Files:**
- Modify: `.gitignore`
- Review: all files listed above

- [ ] **Step 1: Ignore the visual-companion workspace**

Add `.superpowers/` to `.gitignore` so brainstorming artifacts are not published.

- [ ] **Step 2: Run automated verification**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0.

- [ ] **Step 3: Run browser verification**

At desktop and mobile widths, verify all six links, homepage hash offsets, mobile-menu open/close and Escape behavior, direct route loads, browser back/forward, interactive showcase controls, image sizing, and full-size dialog behavior.

- [ ] **Step 4: Compare the rendered header and supplied design asset**

Capture the homepage header and Designs page. Confirm the header retains the supplied screenshot's typography, spacing, dark palette, border, and restrained hierarchy while improving inactive-link legibility and active/focus cues. Confirm the rendered diagram is not cropped, stretched, or visually altered.

- [ ] **Step 5: Review the implementation diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors; only planned files are modified.

- [ ] **Step 6: Commit the implementation**

Run: `git add .gitignore package.json package-lock.json vite.config.ts src/App.tsx src/index.css src/lib/navigation.ts src/lib/navigation.test.ts src/test/setup.ts src/pages/HomePage.tsx src/pages/InteractivePage.tsx src/pages/DesignsPage.tsx src/pages/DesignsPage.test.tsx src/pages/NotFoundPage.tsx src/components/Navigation.tsx src/components/Navigation.test.tsx src/components/Footer.tsx public/images/designs/cicd-pipeline-architecture.png && git commit -m "feat: add portfolio navigation pages"`

Expected: commit succeeds with only planned changes.

- [ ] **Step 7: Push the current branch**

Run: `git push origin main`

Expected: local `main` is published successfully to `origin/main`.
