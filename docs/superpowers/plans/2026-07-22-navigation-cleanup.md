# Portfolio Navigation Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the fixed header the portfolio's single complete navigation system and simplify the footer to identity, social links, and copyright.

**Architecture:** Keep `Navigation` as the route-aware source of all six destinations and make two focused accessibility/content changes inside it. Remove route awareness from `Footer` entirely so it becomes a small presentational component with labelled external social links. Protect both decisions with component-level behavior tests.

**Tech Stack:** React 19, TypeScript, React Router 7, Tailwind CSS, Vitest, Testing Library

---

## File Map

- Modify `src/components/Navigation.test.tsx`: assert the accessible brand name and absence of the inactive language badge.
- Modify `src/components/Navigation.tsx`: label the brand link and remove `EN`.
- Modify `src/components/Footer.test.tsx`: assert duplicate navigation is absent and labelled social links remain.
- Modify `src/components/Footer.tsx`: remove React Router links, simplify the first row, strengthen role contrast, and label icon links.

### Task 1: Clarify the Header

**Files:**
- Modify: `src/components/Navigation.test.tsx`
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Write the failing header assertions**

Add these assertions to the existing route-rendering test:

```tsx
expect(
  screen.getByRole('link', { name: 'Alaric Acaac — DevSecOps/SRE' }),
).toHaveTextContent('alaric@platform:~$');
expect(screen.queryByText('EN')).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/components/Navigation.test.tsx`

Expected: FAIL because the brand link has no descriptive accessible name and `EN` is still rendered.

- [ ] **Step 3: Implement the minimal header changes**

Add the accessible label to the existing brand link:

```tsx
<a
  href="/"
  aria-label="Alaric Acaac — DevSecOps/SRE"
  className="font-display text-[20px] text-[#E8E8EC] tracking-normal rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a89f91]"
>
  alaric@platform:~$
</a>
```

Keep the LinkedIn action and remove the adjacent noninteractive `EN` `<span>`.

- [ ] **Step 4: Run the header test and verify it passes**

Run: `npm test -- src/components/Navigation.test.tsx`

Expected: all Navigation tests PASS.

### Task 2: Simplify the Footer

**Files:**
- Modify: `src/components/Footer.test.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace the route-link test with the desired footer contract**

Use this focused behavior test:

```tsx
it('keeps identity and social links without duplicating primary navigation', () => {
  render(
    <MemoryRouter initialEntries={['/designs']}>
      <Footer />
    </MemoryRouter>,
  );

  expect(screen.getByText('Alaric Acaac')).toBeInTheDocument();
  expect(screen.getByText('DevSecOps/SRE')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/acaacx/',
  );
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/acaacx',
  );
  expect(screen.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/components/Footer.test.tsx`

Expected: FAIL because the icon-only social links have no accessible names and the duplicate Projects and Contact links still exist.

- [ ] **Step 3: Implement the minimal footer changes**

Remove the `Link` import and the duplicate four-link group. Retain the identity block as the only content in the first row, increase the role color to `rgba(255,255,255,0.48)`, and add accessible names:

```tsx
<a
  href="https://www.linkedin.com/in/acaacx/"
  aria-label="LinkedIn"
  target="_blank"
  rel="noopener noreferrer"
>
```

```tsx
<a
  href="https://github.com/acaacx"
  aria-label="GitHub"
  target="_blank"
  rel="noopener noreferrer"
>
```

- [ ] **Step 4: Run the footer test and verify it passes**

Run: `npm test -- src/components/Footer.test.tsx`

Expected: all Footer tests PASS.

### Task 3: Verify and Publish

**Files:**
- Review: `src/components/Navigation.tsx`
- Review: `src/components/Navigation.test.tsx`
- Review: `src/components/Footer.tsx`
- Review: `src/components/Footer.test.tsx`
- Review: `docs/superpowers/specs/2026-07-22-navigation-cleanup-design.md`
- Review: `docs/superpowers/plans/2026-07-22-navigation-cleanup.md`

- [ ] **Step 1: Run the full automated verification suite**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, ESLint exits 0, and Vite produces the production bundle.

- [ ] **Step 2: Run browser verification**

At desktop and mobile widths, confirm the six-item header remains balanced, the mobile menu still contains all six destinations, `EN` is absent, the footer has no duplicate route links, social links remain discoverable, and neither viewport has horizontal overflow.

- [ ] **Step 3: Review the exact diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors and only the planned files are modified.

- [ ] **Step 4: Commit the implementation**

Run:

```bash
git add docs/superpowers/plans/2026-07-22-navigation-cleanup.md src/components/Navigation.tsx src/components/Navigation.test.tsx src/components/Footer.tsx src/components/Footer.test.tsx
git commit -m "fix: simplify portfolio navigation"
```

Expected: the commit succeeds with only the planned implementation and plan files.

- [ ] **Step 5: Push the current branch**

Run: `git push origin main`

Expected: local `main` is published successfully to `origin/main`.
