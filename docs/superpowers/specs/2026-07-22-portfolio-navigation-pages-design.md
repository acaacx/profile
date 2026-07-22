# Portfolio Navigation and Page Split Design

Date: 2026-07-22
Status: Revised design awaiting written-spec review

## Goal

Make the portfolio's primary navigation visibly interactive, move the existing interactive showcase off the homepage, and add a first-class placeholder destination for future design work. Preserve the current dark, restrained visual language and make every destination usable on desktop, mobile, and by keyboard.

## Selected Direction

Use the approved journey-order navigation:

1. About
2. Experience
3. Projects
4. Interactive
5. Designs
6. Contact

This order presents a coherent story: introduction, experience, project evidence, interactive proof, broader design work, and contact.

## Information Architecture

### Home (`/`)

The homepage keeps these existing sections in their current order:

- Hero
- About
- Experience
- Projects
- Contact

The current `LabSection` is removed from the homepage. No other homepage content is redesigned as part of this work.

### Interactive (`/interactive`)

This route becomes the dedicated home for the existing interactive showcase. It reuses the current `LabSection` content and interactions without changing the calculators, business-case content, or pipeline demonstrations.

The page receives a compact route-level introduction above the showcase so visitors understand that the controls are working demonstrations, not static case-study cards.

### Designs (`/designs`)

This route begins the design archive with one real entry and leaves room for future additions. It contains:

- A clear page title: `Designs`
- A concise introduction to the archive
- One gallery entry titled `CI/CD Pipeline Architecture`
- The supplied `BasicCICD.png` diagram shown in full without cropping or visual alteration
- A short description: `A secure, automated delivery reference spanning commit, test, package, GitOps deployment, progressive delivery, and post-deploy observability.`
- A link back to Projects on the homepage

The diagram sits in a wide card that preserves its original aspect ratio. Selecting the image opens a larger view so the labels remain readable. The full-size view has an accessible name, can be closed by keyboard, and returns focus to the gallery entry when dismissed.

The source asset is copied into the site's public design-image directory with a descriptive filename. The page does not invent additional design thumbnails, fake portfolio entries, or placeholder artwork.

## Navigation Behavior

The shared fixed header appears on all routes.

- On the homepage, About, Experience, Projects, and Contact smooth-scroll to their sections.
- On interior routes, those same links return to the matching homepage hash, such as `/#projects`.
- Interactive routes to `/interactive`.
- Designs routes to `/designs`.
- The brand link returns to the top of `/`.
- The current route or active homepage section has a visible active state.
- Browser back and forward navigation work normally.
- When arriving at a homepage hash from another route, the matching section is brought into view after route rendering.

## Desktop Header

Keep the existing height, backdrop blur, border, typography, and spacing character. Use the approved order without a divider or dropdown.

Inactive links receive enough contrast to remain legible against the background. Hover, focus, and active states must be visually distinct without introducing a new color palette. The active route or section uses the existing bright foreground color and a subtle underline or equivalent persistent cue.

## Mobile Header

The current implementation hides the primary links below the desktop breakpoint, which makes the portfolio destinations unreachable from the header. Replace that behavior with a compact menu button using the project's existing icon library.

The mobile menu:

- Contains all six links in the approved order
- Opens and closes from a labelled button
- Closes after navigation
- Supports Escape to close
- Keeps focus visible
- Announces expanded and collapsed state through `aria-expanded`
- Uses touch targets at least 44 by 44 CSS pixels

## Shared Page Shell

The WebGPU background, fixed navigation, and footer remain shared across all routes. Route content owns only the main-page body. This avoids duplicating global visual and behavioral code.

Suggested component boundaries:

- `App`: router and shared shell
- `HomePage`: homepage section composition
- `InteractivePage`: route introduction plus existing `LabSection`
- `DesignsPage`: placeholder content
- `Navigation`: route-aware desktop and mobile navigation

## Accessibility and Interaction Requirements

- Use semantic links for navigation and a semantic button for the mobile-menu control.
- Preserve a logical heading hierarchy with one `h1` per route.
- Ensure keyboard focus is clearly visible for every link and control.
- Do not rely on color alone for the active navigation state.
- Target WCAG AA contrast for navigation and placeholder-page text.
- Respect the user's reduced-motion preference for smooth scrolling and transition effects.
- Prevent fixed-header overlap when navigating to a hash target using scroll margins or equivalent positioning.

## Error and Edge Behavior

- Unknown routes render a simple not-found state with a link to the homepage.
- A missing hash target falls back safely to the homepage without throwing an error.
- Opening a route directly must work in the production hosting configuration through the existing single-page-app fallback.
- If WebGPU is unavailable, existing fallback behavior remains unchanged.

## Verification

Implementation is complete only after:

- TypeScript build and lint pass
- All six desktop navigation links work from every route
- All six mobile navigation links work and the menu keyboard behavior is verified
- Direct loads of `/`, `/interactive`, and `/designs` render successfully
- Browser back and forward behavior is verified
- Hash navigation from an interior route lands below the fixed header
- The interactive showcase no longer appears on the homepage and remains fully functional on `/interactive`
- The Designs page renders the supplied CI/CD diagram without cropping, distortion, or fabricated companion items
- The enlarged design view opens, closes, and returns focus correctly by mouse and keyboard
- Desktop and mobile screenshots are visually compared against the existing design language

## Audit Notes Informing the Design

The supplied header screenshot shows a strong restrained layout and clear high-level labels. It also suggests two visible risks: secondary text and inactive navigation links appear very low contrast, and interaction states are not evident in the still image. The implementation should strengthen legibility and supply visible hover, focus, and active states while preserving the aesthetic.

A screenshot cannot confirm keyboard access, semantic structure, exact contrast ratios, responsive reflow, reduced-motion behavior, or screen-reader clarity. Those items require coded and browser verification.

## Out of Scope

- Redesigning homepage content or project cards
- Creating additional design portfolio entries beyond the supplied CI/CD diagram
- Changing the existing interactive showcase calculations or copy
- Replacing the background renderer or global visual system
- Publishing or deploying the site
