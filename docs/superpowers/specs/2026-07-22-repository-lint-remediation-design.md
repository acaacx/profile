# Repository Lint Remediation Design

Date: 2026-07-22
Status: Approved for implementation

## Goal

Make `npm run lint` complete with zero errors and zero warnings while preserving the portfolio's current runtime behavior and avoiding broad lint suppression.

## Current Failure Groups

The clean baseline contains 11 errors and 2 warnings in four distinct groups:

1. Three WebGPU texture and bind-group bindings use `let` even though the bindings are never reassigned.
2. Generated `src/components/ui` modules intentionally export reusable variants and hooks beside components, conflicting with the Vite Fast Refresh export-shape rule.
3. `SidebarMenuSkeleton` calls `Math.random()` during render, violating React's render-purity rule.
4. Two hook dependency lists do not match the values actually read by their callbacks.

## Selected Approach

Apply real code fixes where lint identifies runtime or maintainability problems, and add one narrowly scoped configuration exception for the generated UI module pattern.

### WebGPU Bindings

Change `cellStateA`, `cellStateB`, and `bindGroups` from `let` to `const`. Their referenced GPU objects remain mutable; only rebinding is prohibited. This is behavior-preserving.

### Generated UI Fast Refresh Exports

Add an ESLint configuration block matching only `src/components/ui/**/*.{ts,tsx}` and disable `react-refresh/only-export-components` in that directory. These modules follow the established component-library pattern of co-locating components with variant builders and hooks. Splitting every export would create wide import churn without improving product behavior, while disabling the rule globally would hide future violations in application code.

All other React, hooks, TypeScript, and ESLint rules remain active in the UI directory.

### Sidebar Skeleton Purity

Replace render-time randomness with a deterministic width derived from React's stable `useId()` value. The result remains within the existing 50–89% range, retains visual variation between skeleton instances, and stays stable across rerenders without calling an impure function.

### Hook Dependencies

For `useScrollAnimation`, destructure the option primitives before `useEffect` and list those primitives as dependencies. This prevents an object literal from forcing unnecessary reruns while allowing a meaningful option change to recreate the animation with fresh values.

For `LabSection`, remove `clusters` and `wastePercent` from the cost-results memo dependency list because the memoized calculation does not read either value. Both values remain available to the surrounding rendered explanatory copy, preserving the existing UI.

## Verification Strategy

`npm run lint` is the failing regression command and must be observed failing before implementation and passing afterward. Automated component tests and the production build provide behavioral and type-safety coverage for the refactors.

Completion requires:

- `npm run lint` reports zero errors and zero warnings.
- `npm test` passes all existing tests.
- `npm run build` succeeds.
- `git diff --check` reports no whitespace errors.
- Only the planned source, configuration, test, and documentation files are changed.

## Out of Scope

- Reworking the cost calculator's formulas
- Splitting the generated UI library into new modules
- Disabling Fast Refresh validation outside `src/components/ui`
- Redesigning skeletons, animations, or WebGPU effects
- Updating dependencies or Browserslist data
