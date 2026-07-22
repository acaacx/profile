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
