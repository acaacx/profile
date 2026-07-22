import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, getNavigationHref, isUnmodifiedPrimaryClick } from './navigation';

describe('navigation contract', () => {
  it('keeps the approved journey order', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'About',
      'Experience',
      'Projects',
      'Interactive',
      'Designs',
      'Contact',
    ]);
  });

  it('uses local hashes on home and home hashes on interior routes', () => {
    expect(getNavigationHref('/', NAV_ITEMS[0])).toBe('#about');
    expect(getNavigationHref('/interactive', NAV_ITEMS[0])).toBe('/#about');
    expect(getNavigationHref('/', NAV_ITEMS[3])).toBe('/interactive');
  });

  it('only intercepts unmodified primary clicks', () => {
    const primaryClick = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };

    expect(isUnmodifiedPrimaryClick(primaryClick)).toBe(true);
    expect(isUnmodifiedPrimaryClick({ ...primaryClick, metaKey: true })).toBe(false);
    expect(isUnmodifiedPrimaryClick({ ...primaryClick, ctrlKey: true })).toBe(false);
    expect(isUnmodifiedPrimaryClick({ ...primaryClick, button: 1 })).toBe(false);
  });
});
