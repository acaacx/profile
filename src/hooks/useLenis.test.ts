import { describe, expect, it } from 'vitest';
import { getLenisOptions } from './useLenis';

describe('getLenisOptions', () => {
  it('disables JavaScript smoothing when reduced motion is requested', () => {
    expect(getLenisOptions(true)).toMatchObject({ lerp: 1, smoothWheel: false });
    expect(getLenisOptions(false)).toMatchObject({ lerp: 0.08, smoothWheel: true });
  });
});
