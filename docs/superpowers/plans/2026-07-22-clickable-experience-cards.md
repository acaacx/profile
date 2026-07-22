# Clickable Experience Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Work Experience role a collapsed-by-default, full-width accordion card whose details appear only after activation.

**Architecture:** Keep the existing experience data and scroll entrance animation in `ExperienceSection.tsx`. Replace its bespoke height animation with a controlled, single-value Radix accordion using the repo's existing accordion wrappers; this provides one-open-at-a-time state, native button semantics, ARIA wiring, keyboard input, and reduced-motion-compatible CSS animations.

**Tech Stack:** React 19, TypeScript, Radix Accordion, Lucide React, Tailwind CSS, Vitest, Testing Library, GSAP

---

## File Structure

- Create `src/sections/ExperienceSection.test.tsx`: interaction regression coverage for initial state, single-open behavior, collapse, and keyboard activation.
- Modify `src/sections/ExperienceSection.tsx`: render the experience list as a controlled Radix accordion while preserving role content and GSAP entrance behavior.
- Modify `design-qa.md`: record responsive visual and interaction evidence for the new experience cards.
- Create `qa-experience-cards-desktop.jpg`, `qa-experience-card-open-desktop.jpg`, and `qa-experience-card-open-mobile.jpg`: final browser evidence.

### Task 1: Add the Experience Accordion Regression Tests

**Files:**
- Create: `src/sections/ExperienceSection.test.tsx`
- Test: `src/sections/ExperienceSection.test.tsx`

- [ ] **Step 1: Write the failing interaction tests**

Create `src/sections/ExperienceSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ExperienceSection from './ExperienceSection';

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

describe('ExperienceSection', () => {
  it('starts with every role collapsed', () => {
    render(<ExperienceSection />);

    const roleButtons = screen.getAllByRole('button');
    expect(roleButtons).toHaveLength(4);
    roleButtons.forEach((button) => expect(button).toHaveAttribute('aria-expanded', 'false'));
    expect(screen.queryByText(/Operated and supported 100\+ Kubernetes clusters/i)).not.toBeInTheDocument();
  });

  it('shows only the selected role details and allows it to collapse', async () => {
    const user = userEvent.setup();
    render(<ExperienceSection />);

    const sre = screen.getByRole('button', { name: /Site Reliability Engineer/i });
    const devsecops = screen.getByRole('button', { name: /DevSecOps Engineer/i });

    await user.click(sre);
    expect(sre).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Operated and supported 100\+ Kubernetes clusters/i)).toBeVisible();

    await user.click(devsecops);
    expect(sre).toHaveAttribute('aria-expanded', 'false');
    expect(devsecops).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText(/Operated and supported 100\+ Kubernetes clusters/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Built and maintained GitLab-to-Jenkins CI\/CD pipelines/i)).toBeVisible();

    await user.click(devsecops);
    expect(devsecops).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/Built and maintained GitLab-to-Jenkins CI\/CD pipelines/i)).not.toBeInTheDocument();
  });

  it('opens a focused role with the keyboard', async () => {
    const user = userEvent.setup();
    render(<ExperienceSection />);

    const firstRole = screen.getByRole('button', { name: /Site Reliability Engineer/i });
    firstRole.focus();
    await user.keyboard('{Enter}');

    expect(firstRole).toHaveAttribute('aria-expanded', 'true');
  });
});
```

- [ ] **Step 2: Run the tests and verify the initial-state test fails**

Run:

```bash
npm test -- --run src/sections/ExperienceSection.test.tsx
```

Expected: FAIL because the existing component initializes `expandedIndex` to `0`, leaving the first role open on initial render.

### Task 2: Replace the Bespoke Cards With a Controlled Radix Accordion

**Files:**
- Modify: `src/sections/ExperienceSection.tsx`
- Test: `src/sections/ExperienceSection.test.tsx`

- [ ] **Step 1: Replace the imports and card implementation**

In `src/sections/ExperienceSection.tsx`, remove `GlassCard`, import the accordion wrappers, and use a controlled string value:

```tsx
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../components/SectionLabel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
```

Replace `ExperienceCard` with:

```tsx
function ExperienceCard({ item, value }: { item: ExperienceItem; value: string }) {
  return (
    <AccordionItem
      value={value}
      className="exp-card glass-card accent-border overflow-hidden border border-white/[0.06] data-[state=open]:border-[#a89f91]/30 data-[state=open]:bg-white/[0.045]"
    >
      <AccordionTrigger className="min-h-[124px] w-full cursor-pointer px-5 py-5 md:px-7 md:py-6 hover:no-underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a89f91] [&>svg]:mr-1 [&>svg]:size-5 [&>svg]:text-white/35">
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-left md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h3 className="text-[18px] font-medium text-[#E8E8EC] md:text-[20px]">{item.title}</h3>
            <p className="mt-1 text-[14px] text-white/50">{item.company}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pr-2 text-[12px] text-white/40 md:justify-end">
            <span>{item.period}</span>
            <span>{item.location}</span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-5 pb-6 md:px-7 md:pb-7">
        <div className="border-t border-white/[0.06] pt-5">
          <ul className="space-y-2.5">
            {item.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 text-[14px] leading-[1.65] text-white/55"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#7c6f64]"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/[0.05] px-3 py-1 text-[12px] text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
```

- [ ] **Step 2: Render all roles through the controlled accordion**

Replace `expandedIndex` with:

```tsx
const [expandedRole, setExpandedRole] = useState('');
```

Replace the experience list with:

```tsx
<Accordion
  type="single"
  collapsible
  value={expandedRole}
  onValueChange={setExpandedRole}
  className="space-y-6"
>
  {EXPERIENCE.map((item, index) => (
    <ExperienceCard key={`${item.company}-${item.title}`} item={item} value={`role-${index}`} />
  ))}
</Accordion>
```

- [ ] **Step 3: Run the focused tests and verify they pass**

Run:

```bash
npm test -- --run src/sections/ExperienceSection.test.tsx
```

Expected: 3 tests PASS with no warnings.

- [ ] **Step 4: Run focused lint**

Run:

```bash
npx eslint src/sections/ExperienceSection.tsx src/sections/ExperienceSection.test.tsx
```

Expected: exit code `0` with no errors.

- [ ] **Step 5: Commit the tested accordion**

```bash
git add src/sections/ExperienceSection.tsx src/sections/ExperienceSection.test.tsx
git commit -m "feat: make experience roles clickable cards"
```

### Task 3: Verify the Finished Interaction and Record Design QA

**Files:**
- Modify: `design-qa.md`
- Create: `qa-experience-cards-desktop.jpg`
- Create: `qa-experience-card-open-desktop.jpg`
- Create: `qa-experience-card-open-mobile.jpg`

- [ ] **Step 1: Run the complete automated verification**

Run:

```bash
npm test
npx eslint src/sections/ExperienceSection.tsx src/sections/ExperienceSection.test.tsx
npm run build
git diff --check
```

Expected: all tests PASS, focused lint exits `0`, the production build exits `0`, and `git diff --check` prints nothing.

- [ ] **Step 2: Verify desktop behavior in the in-app browser**

At `http://127.0.0.1:4173/#experience` with a `1440 × 1000` CSS viewport:

1. Capture all four collapsed cards as `qa-experience-cards-desktop.jpg`.
2. Confirm every trigger reports `aria-expanded="false"`.
3. Click Site Reliability Engineer and capture `qa-experience-card-open-desktop.jpg`.
4. Confirm its responsibilities and tags appear inside the same card.
5. Click DevSecOps Engineer and confirm the Site Reliability Engineer details disappear.
6. Press Escape only where applicable; accordion state should remain unchanged because Escape is not an accordion toggle.
7. Inspect the browser console and record any warning or error.

- [ ] **Step 3: Verify mobile behavior in the in-app browser**

At `390 × 844` CSS viewport:

1. Confirm the title, company, period, and location wrap without horizontal overflow.
2. Open Senior DevOps Engineer and capture `qa-experience-card-open-mobile.jpg`.
3. Confirm the focus ring is visible under keyboard navigation and the entire summary trigger is at least 44px tall.
4. Confirm the page has no horizontal overflow.

- [ ] **Step 4: Compare reference and implementation together**

Inspect the supplied screenshot and the collapsed desktop capture in one comparison view. Confirm the implementation preserves the screenshot's dark cards, restrained borders, large role labels, muted metadata, generous collapsed height, centered chevrons, and vertical rhythm. Record intentional differences: the implementation uses stronger focus/hover affordances and maintains the repo's existing `800px` content width.

- [ ] **Step 5: Update `design-qa.md`**

Append evidence paths, viewports, interaction results, comparison notes, and any issue/fix loop. End the document with:

```markdown
final result: passed
```

- [ ] **Step 6: Commit QA evidence**

```bash
git add design-qa.md qa-experience-cards-desktop.jpg qa-experience-card-open-desktop.jpg qa-experience-card-open-mobile.jpg
git commit -m "docs: verify clickable experience cards"
```

### Task 4: Final Repository Verification

**Files:**
- Verify only; no expected file changes.

- [ ] **Step 1: Re-run the full suite from the committed tree**

Run:

```bash
npm test
npx eslint src/sections/ExperienceSection.tsx src/sections/ExperienceSection.test.tsx
npm run build
git status --short
```

Expected: all tests PASS, focused lint exits `0`, the build exits `0`, and `git status --short` prints nothing.

- [ ] **Step 2: Review the final commit range**

Run:

```bash
git log -3 --oneline
git diff HEAD~2..HEAD --check
```

Expected: the feature and QA commits are present and the diff check prints nothing.
