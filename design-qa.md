# Design QA

## Evidence

- Header source visual truth: `/Users/alaric/Documents/screenshots/Screenshot 2026-07-22 at 7.53.56 PM.png`
- Design asset source visual truth: `/Users/alaric/Downloads/BasicCICD.png`
- Desktop homepage implementation: `/Users/alaric/antigravity/profile/qa-home-desktop-v4.png`
- Desktop Designs implementation: `/Users/alaric/antigravity/profile/qa-designs-desktop.png`
- Desktop enlarged design implementation: `/Users/alaric/antigravity/profile/qa-design-dialog-desktop-v2.png`
- Mobile homepage implementation: `/Users/alaric/antigravity/profile/qa-home-mobile-v2.png`
- Mobile menu implementation: `/Users/alaric/antigravity/profile/qa-mobile-menu.png`
- Mobile Interactive implementation: `/Users/alaric/antigravity/profile/qa-interactive-mobile-v3.png`
- Mobile Designs implementation: `/Users/alaric/antigravity/profile/qa-designs-mobile-top.png`
- Mobile full-size viewer implementation: `/Users/alaric/antigravity/profile/qa-design-dialog-mobile.jpg`
- Experience source visual truth: `/var/folders/cy/dfhp1qd54152z2pt8xwxf9t80000gn/T/TemporaryItems/NSIRD_screencaptureui_glMB6B/Screenshot 2026-07-22 at 8.08.30 PM.png`
- Desktop collapsed experience cards: `/Users/alaric/antigravity/profile/qa-experience-cards-desktop.jpg`
- Desktop expanded experience card: `/Users/alaric/antigravity/profile/qa-experience-card-open-desktop.jpg`
- Mobile expanded experience card: `/Users/alaric/antigravity/profile/qa-experience-card-open-mobile.jpg`

## Viewports and Normalization

- Desktop CSS viewport: `1440 × 1000`, device scale factor `1`.
- Desktop screenshot pixels: `1434 × 996` for the homepage capture and `1440 × 1000` for the enlarged-view capture. The small browser-surface difference does not alter page layout.
- Mobile CSS viewport: `390 × 844`, device scale factor `1`.
- Mobile screenshot pixels: `384 × 831`, reflecting the in-app browser's content surface.
- Header source pixels: `2022 × 272`.
- Diagram source pixels: `1536 × 1024`.
- The diagram was copied without re-encoding. Source and public asset SHA-256 digests both equal `64439980a41f8826ccab9cc4abe416ef391033bb9d773873762685f10b188442`.
- The diagram uses `object-contain` and its intrinsic aspect ratio. No density normalization or crop correction was needed because the exact source raster is rendered directly.

## State and Interactions Tested

- Homepage at the top with fixed desktop navigation.
- Desktop navigation from Home to Designs and route-active state.
- Designs gallery card and full-size dialog.
- Dialog Escape close behavior and focus-managed Radix dialog semantics.
- Mobile homepage at `390px` CSS width.
- Mobile menu closed and open states.
- Mobile navigation from Home to Interactive.
- Interactive route opening at the route introduction rather than retaining prior page scroll.
- Designs page mobile reflow with no horizontal overflow (`scrollWidth 384`, viewport content width `384`).
- Mobile full-size viewer exposes the complete oversized image to two-axis panning (`image width 960`, viewer width `348`, scroll width `960`).
- Browser Back restores the previous homepage reading position for plain and hash-bearing entries (`1200px` and `2200px` respectively) while a pushed Designs route opens at `0px`.
- Modified primary clicks and middle clicks remain native browser actions rather than being intercepted by client routing.
- Reduced-motion preference disables Lenis wheel smoothing and switches route motion to immediate/automatic behavior.
- All four experience roles start collapsed and expose `aria-expanded="false"`.
- Activating a role reveals its responsibilities and tags; opening another role closes the previous one; activating the open role collapses it.
- Experience summaries use native button semantics and support Enter/Space activation. Accordion reveal animation is disabled under reduced motion.
- Mobile experience cards fit a `384px` content viewport without horizontal overflow (`scrollWidth 384`) and keep a `124px` summary trigger.
- Direct loads of `/`, `/interactive`, and `/designs`.
- Console inspection on desktop and mobile: no warnings or errors.

## Full-View Comparison

The supplied header screenshot and rendered homepage header were inspected together. The implementation preserves the source's black surface, fine bottom border, serif identity, muted navigation, and restrained hierarchy. The approved additional destinations require tighter horizontal spacing than the four-link source. The repo's existing terminal-style brand and LinkedIn/locale controls remain intentionally unchanged.

The supplied CI/CD source and the rendered full-size dialog were inspected together. The pipeline stages, typography within the raster, color bands, legends, arrows, and post-deploy row are visually identical. The dialog adds only the requested surrounding viewer chrome.

The supplied Work Experience screenshot and the collapsed desktop capture were inspected together. The implementation retains the source's dark glass cards, fine borders, large role labels, muted company/date/location hierarchy, generous collapsed height, chevron affordance, and vertical rhythm. The apparent width difference is consistent with viewport and screenshot-density normalization; the implementation intentionally keeps the repo's established `800px` experience container.

## Focused Comparison

A separate crop comparison was not needed for the diagram because the source file and served asset have identical SHA-256 digests, the complete raster is visible in the full-size screenshot, and the text-bearing regions are readable at the inspected desktop viewport. Header interaction states were checked through DOM state and route navigation rather than a static crop.

## Required Fidelity Surfaces

- Fonts and typography: The site retains its existing Newsreader, Inter, and JetBrains Mono hierarchy. The header remains editorial and restrained; route headings match the established display treatment.
- Spacing and layout rhythm: The 72px fixed header, centered `1200px` navigation container, `1100px` route content container, and card spacing remain consistent across routes. Mobile content maintains 24px side padding and does not overflow.
- Colors and visual tokens: Existing near-black backgrounds, warm-gray accent, fine white borders, and glass surfaces are preserved. Route body copy was raised to `rgba(255,255,255,0.66)` for stronger legibility.
- Image quality and asset fidelity: The supplied raster is copied byte-for-byte, displayed uncropped in the gallery, and shown at a readable scale in the dialog. No placeholder, reconstruction, or generated substitute is used.
- Copy and content: Navigation order matches the approved journey. Interactive copy describes working demos; Designs copy accurately names and describes the supplied diagram without inventing additional entries.

## Comparison History

1. Initial desktop homepage capture
   - Finding: `[P1]` The fixed header remained nearly transparent because its GSAP `from` animation was resolving against an opacity-zero end state and could stall under the current animation loop.
   - Fix: Removed the persistent opacity-zero class and the unreliable imperative header entrance animation.
   - Post-fix evidence: `qa-home-desktop-v4.png` shows the header fully visible with all six links.

2. Initial enlarged-view capture
   - Finding: `[P1]` The shared dialog's `sm:max-w-lg` class constrained the design to a narrow portrait panel, making the diagram unreadable.
   - Fix: Added an explicit `sm:max-w-[96vw]` override while preserving the 92vh limit and intrinsic image aspect ratio.
   - Post-fix evidence: `qa-design-dialog-desktop-v2.png` shows the full diagram legibly across the viewport.

3. Initial mobile route-navigation capture
   - Finding: `[P1]` Lenis retained the previous long-page scroll position when navigating to Interactive, placing the introduction thousands of pixels above the viewport.
   - Fix: Routed location changes through the active Lenis instance and reset non-hash routes immediately to zero; hash routes now use the same instance with the fixed-header offset.
   - Post-fix evidence: `qa-interactive-mobile-v3.png`; measured `scrollY: 0` and heading top `203.1875px`.

4. Initial route-copy capture
   - Finding: `[P2]` Route introduction and gallery-description text were too subdued on the near-black surface.
   - Fix: Added a route-specific `0.66` white alpha text token.
   - Post-fix evidence: `qa-interactive-mobile-v3.png` and `qa-designs-mobile-top.png` show clearly legible copy without changing the palette.

5. Browser-history review
   - Finding: `[P1]` Every non-hash location change reset to the top, including browser Back/Forward navigation.
   - Fix: Added location-keyed scroll-position storage, manual browser scroll restoration, POP-aware Lenis restoration, and a pre-scroll Lenis resize so restoration uses the destination page's dimensions.
   - Post-fix evidence: navigating Home (`1200px`) → Designs (`0px`) → Back restored the homepage to `1200px`; repeating from `/#projects` at `2200px` restored the hash-bearing entry to `2200px` rather than forcing the section anchor.

6. Reduced-motion review
   - Finding: `[P1]` CSS motion preferences did not disable Lenis' JavaScript wheel smoothing.
   - Fix: Lenis now rebuilds when the media query changes, with smoothing disabled and immediate interpolation under reduced motion.
   - Post-fix evidence: option-policy unit coverage verifies both reduced and standard motion configurations.

7. Modified-click review
   - Finding: `[P2]` Navigation prevented every click, so Cmd/Ctrl/Shift/Alt-click and middle-click could not use native browser behavior.
   - Fix: Client routing now handles only unmodified primary clicks.
   - Post-fix evidence: navigation-policy unit coverage verifies modified and non-primary clicks are not intercepted.

8. Mobile full-size viewer review
   - Finding: `[P1]` The enlarged image initially fit back down to the mobile viewport; the first intrinsic-width revision then centered overflow and made part of the left edge unreachable.
   - Fix: The image keeps a `960px` minimum width and aligns to the scroll origin through tablet and small-desktop widths; at `xl`, the wider dialog switches to centered contain behavior.
   - Post-fix evidence: `qa-design-dialog-mobile.jpg`; measured image/scroll width `960px` within a `348px` viewport, confirming end-to-end panning.

9. Experience-card entrance review
   - Finding: `[P1]` The initial Radix conversion left cards at `opacity: 0` in the development preview because React Strict Mode replayed the GSAP `from` animation after its first cleanup had left inline start styles behind.
   - Fix: Replaced the implicit-destination `from` animation with an explicit `fromTo` transition ending at `opacity: 1` and `x: 0`. Also removed nested role headings and added reduced-motion handling to the shared accordion content primitive.
   - Post-fix evidence: `qa-experience-cards-desktop.jpg`; measured first-card opacity `1`, transform `matrix(1, 0, 0, 1, 0, 0)`, four collapsed ARIA states, and no console warnings or errors.

## Findings

No actionable P0, P1, or P2 differences remain.

## Follow-up Polish

- `[P3]` The supplied reference uses `Alaric Acaac` as the header identity, while the current repo intentionally retains `alaric@platform:~$`. This predates the requested navigation/page work and can be aligned in a separate branding pass if desired.

## Implementation Checklist

- [x] Six-link desktop navigation in approved order
- [x] Mobile navigation with labelled control, Escape close, and 44px target
- [x] Interactive showcase moved off Home
- [x] Designs gallery uses supplied asset without alteration
- [x] Full-size design viewer is readable, pannable on mobile, and keyboard-dismissible
- [x] Route, hash, and browser-history scrolling work with Lenis
- [x] Reduced-motion and modified-click behavior covered
- [x] Experience roles collapsed by default with single-open, repeat-to-close behavior
- [x] Experience cards expose native button, ARIA, focus, and reduced-motion behavior
- [x] Desktop and mobile layouts inspected
- [x] Browser console checked

final result: passed
