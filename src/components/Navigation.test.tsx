import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import Navigation from './Navigation';

vi.mock('gsap', () => ({
  default: { from: vi.fn() },
}));

describe('Navigation', () => {
  it('renders the approved links and marks the current route', () => {
    render(
      <MemoryRouter initialEntries={['/interactive']}>
        <Navigation />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('link', { name: 'Interactive' })[0]).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.queryByRole('link', { name: 'Sandbox' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).not.toHaveClass(
      'opacity-0',
    );

    const desktopLabels = screen
      .getByTestId('desktop-navigation')
      .querySelectorAll('a');
    expect(Array.from(desktopLabels, (link) => link.textContent)).toEqual([
      'About',
      'Experience',
      'Projects',
      'Interactive',
      'Designs',
      'Contact',
    ]);
  });

  it('opens and closes the mobile menu', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);
    expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

});
