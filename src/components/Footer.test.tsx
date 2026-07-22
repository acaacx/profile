import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('links homepage sections safely from interior routes', () => {
    render(
      <MemoryRouter initialEntries={['/designs']}>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/#contact');
  });
});
