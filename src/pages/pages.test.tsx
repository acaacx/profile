import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage';
import InteractivePage from './InteractivePage';
import NotFoundPage from './NotFoundPage';

vi.mock('../sections/HeroSection', () => ({ default: () => <div>Hero section</div> }));
vi.mock('../sections/AboutSection', () => ({ default: () => <div>About section</div> }));
vi.mock('../sections/ExperienceSection', () => ({ default: () => <div>Experience section</div> }));
vi.mock('../sections/ProjectsSection', () => ({ default: () => <div>Projects section</div> }));
vi.mock('../sections/ContactSection', () => ({ default: () => <div>Contact section</div> }));
vi.mock('../sections/LabSection', () => ({ default: () => <div>Interactive showcase</div> }));

describe('route pages', () => {
  it('keeps the interactive showcase off the homepage', () => {
    render(<HomePage />);
    expect(screen.getByText('Projects section')).toBeInTheDocument();
    expect(screen.queryByText('Interactive showcase')).not.toBeInTheDocument();
  });

  it('introduces and renders the interactive showcase on its own page', () => {
    render(<InteractivePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Interactive' })).toBeInTheDocument();
    expect(screen.getByText('Interactive showcase')).toBeInTheDocument();
  });

  it('offers a route home from the not-found page', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
  });
});
