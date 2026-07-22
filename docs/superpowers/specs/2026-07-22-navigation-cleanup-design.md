# Portfolio Navigation Cleanup Design

Date: 2026-07-22
Status: Approved for implementation

## Goal

Remove redundant or misleading navigation elements while preserving the portfolio's current dark, restrained visual language and keeping every real destination easy to find.

## Selected Direction

Use one complete navigation system in the fixed header and a deliberately minimal footer.

- Keep the six approved destinations in the header: About, Experience, Projects, Interactive, Designs, and Contact.
- Remove the inactive `EN` badge until a real language-switching feature exists.
- Keep the terminal-style brand visually unchanged, but give it the accessible name `Alaric Acaac — DevSecOps/SRE`.
- Remove the footer's duplicate four-link navigation because it omits Interactive and Designs and competes with the complete header.
- Retain the footer identity, role, LinkedIn, GitHub, and copyright.

This is the recommended option from the navigation audit. The rejected alternative was to keep a footer navigation landmark synchronized with `NAV_ITEMS`; that would be consistent, but still duplicate the primary information architecture without adding meaningful utility on this compact portfolio.

## Component Changes

### Header

`Navigation` remains the single source of site navigation. The link order, active states, mobile menu, LinkedIn action, dimensions, and styling remain unchanged. Only two focused adjustments are made:

1. Add a descriptive `aria-label` to the brand link while retaining `alaric@platform:~$` as its visible text.
2. Remove the noninteractive `EN` badge so visitors are not presented with a control-like element that has no behavior.

### Footer

`Footer` becomes a compact identity and social block. The first row contains only the name and role. The second row retains LinkedIn and GitHub links plus copyright. Removing the duplicate route links also removes the need for React Router's `Link` import in this component.

The role text remains visible but receives slightly stronger contrast than the current secondary treatment. Social links keep the existing icons and open in new tabs. Each icon-only link receives an explicit accessible name.

## Accessibility Requirements

- The brand link must have an accessible name that identifies the person and role, not only the terminal prompt.
- Icon-only LinkedIn and GitHub links must have explicit accessible names.
- Removing `EN` must not remove or alter any real site destination.
- Removing footer navigation must not affect access to any route because the complete fixed header remains available on all pages.
- Existing keyboard focus styles, mobile menu behavior, active-route semantics, and reduced-motion behavior remain unchanged.
- Text contrast should be improved where practical, but this focused change is not a claim of full WCAG conformance.

## Testing

- A navigation component test proves the terminal brand exposes the descriptive accessible name and that `EN` is absent.
- A footer component test proves the duplicate section links are absent while the identity and labelled social links remain.
- Existing navigation, routing, page, and experience-card tests remain green.
- Lint and production build must pass.
- Desktop and mobile browser checks confirm the header spacing remains balanced and the simplified footer reflows without overflow.

## Out of Scope

- Building localization or a language picker
- Changing the six-item navigation order
- Redesigning the header, footer, contact section, or social icons
- Adding new destinations or content
- Deploying or publishing outside the requested Git push
