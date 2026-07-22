import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { PortfolioRoutes, ScrollManager } from './App';

vi.mock('./pages/HomePage', () => ({ default: () => <div>Home route</div> }));
vi.mock('./pages/InteractivePage', () => ({ default: () => <div>Interactive route</div> }));
vi.mock('./pages/DesignsPage', () => ({ default: () => <div>Designs route</div> }));
vi.mock('./pages/NotFoundPage', () => ({ default: () => <div>Not found route</div> }));

describe('PortfolioRoutes', () => {
  it.each([
    ['/', 'Home route'],
    ['/interactive', 'Interactive route'],
    ['/designs', 'Designs route'],
    ['/missing', 'Not found route'],
  ])('renders %s', (path, expected) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <PortfolioRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('resets Lenis to the top when a route has no hash', async () => {
    const scrollTo = vi.fn();
    const resize = vi.fn();
    const lenisRef = { current: { resize, scrollTo } };

    render(
      <MemoryRouter initialEntries={['/interactive']}>
        <ScrollManager lenisRef={lenisRef} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(resize).toHaveBeenCalled();
      expect(scrollTo).toHaveBeenCalledWith(0, { force: true, immediate: true });
    });
  });
});
