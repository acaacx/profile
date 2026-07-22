import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('keeps identity and social links without duplicating primary navigation', () => {
    render(
      <MemoryRouter initialEntries={['/designs']}>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText('Alaric Acaac')).toBeInTheDocument();
    expect(screen.getByText('DevSecOps/SRE')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/acaacx/',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/acaacx',
    );
    expect(screen.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
  });
});
