# Clickable Experience Cards Design

## Goal

Turn the Work Experience list into a compact, accessible single-open accordion. Role summaries remain visible at all times; responsibilities and technology tags appear only after the visitor activates a role card.

## Interaction

- Every role starts collapsed, including the most recent role.
- The complete summary area for a role acts as the trigger, not only the chevron.
- Activating a collapsed role opens its details and closes any other open role.
- Activating the open role collapses it, returning the section to an all-collapsed state.
- Mouse, touch, Enter, and Space activation are supported through native button semantics.
- Each trigger exposes its state with `aria-expanded` and identifies its detail region with `aria-controls`.
- The chevron rotates when open. The open card also receives a slightly stronger border and surface treatment.
- Motion respects `prefers-reduced-motion`; content is revealed without a long transition when reduced motion is requested.

## Visual Treatment

- Preserve the existing near-black glass-card system, typography, spacing, and warm-gray accent.
- Keep title and company grouped on the left and period and location on the right at desktop widths.
- Stack metadata beneath the role summary on smaller screens without truncating dates or locations.
- Make the clickable affordance explicit with a pointer cursor, full-card hover treatment, and visible keyboard focus ring.
- Keep collapsed cards compact. Expanded bullets and tags sit below a subtle divider within the same card.
- Use the existing Lucide icon set for the chevron rather than a custom SVG.

## Component Structure

- `ExperienceSection` owns the currently expanded role identifier or `null` when all cards are closed.
- `ExperienceCard` receives the role data, open state, and toggle callback.
- The existing `EXPERIENCE` data remains unchanged.
- The card uses the repo's Radix accordion primitives so state, keyboard behavior, and content mounting semantics are handled consistently.

## Testing

- Confirm every role is collapsed on initial render and no responsibility text is visible.
- Confirm clicking a role reveals its bullets and sets `aria-expanded="true"`.
- Confirm opening another role closes the first.
- Confirm clicking the open role collapses it.
- Confirm the cards are operable by keyboard and retain the approved role order.
- Run focused lint, the complete test suite, production build, and responsive browser QA.

## Scope

This change affects only the Work Experience cards. Role copy, dates, locations, tags, other homepage sections, and site navigation remain unchanged.
