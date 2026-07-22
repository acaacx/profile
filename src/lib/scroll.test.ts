import { describe, expect, it } from 'vitest';
import { getRouteScrollTarget } from './scroll';

describe('getRouteScrollTarget', () => {
  it('returns a saved position for browser history navigation only', () => {
    expect(getRouteScrollTarget('POP', 640)).toBe(640);
    expect(getRouteScrollTarget('PUSH', 640)).toBeUndefined();
    expect(getRouteScrollTarget('REPLACE', 640)).toBeUndefined();
    expect(getRouteScrollTarget('POP')).toBeUndefined();
  });
});
