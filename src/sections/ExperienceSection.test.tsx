import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ExperienceSection from './ExperienceSection';

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

describe('ExperienceSection', () => {
  it('starts with every role collapsed', () => {
    render(<ExperienceSection />);

    const roleButtons = screen.getAllByRole('button');
    expect(roleButtons).toHaveLength(4);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    roleButtons.forEach((button) => expect(button).toHaveAttribute('aria-expanded', 'false'));
    expect(
      screen.queryByText(/Operated and supported 100\+ Kubernetes clusters/i),
    ).not.toBeInTheDocument();
  });

  it('shows only the selected role details and allows it to collapse', async () => {
    const user = userEvent.setup();
    render(<ExperienceSection />);

    const sre = screen.getByRole('button', { name: /Site Reliability Engineer/i });
    const devsecops = screen.getByRole('button', { name: /DevSecOps Engineer/i });

    await user.click(sre);
    expect(sre).toHaveAttribute('aria-expanded', 'true');
    const sreResponsibility = screen.getByText(
      /Operated and supported 100\+ Kubernetes clusters/i,
    );
    expect(sreResponsibility).toBeVisible();
    expect(sreResponsibility.closest('[data-slot="accordion-content"]')).toHaveClass(
      'motion-reduce:!animate-none',
    );

    await user.click(devsecops);
    expect(sre).toHaveAttribute('aria-expanded', 'false');
    expect(devsecops).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.queryByText(/Operated and supported 100\+ Kubernetes clusters/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Built and maintained GitLab-to-Jenkins CI\/CD pipelines/i),
    ).toBeVisible();

    await user.click(devsecops);
    expect(devsecops).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByText(/Built and maintained GitLab-to-Jenkins CI\/CD pipelines/i),
    ).not.toBeInTheDocument();
  });

  it('opens a focused role with the keyboard', async () => {
    const user = userEvent.setup();
    render(<ExperienceSection />);

    const firstRole = screen.getByRole('button', { name: /Site Reliability Engineer/i });
    firstRole.focus();
    await user.keyboard('{Enter}');

    expect(firstRole).toHaveAttribute('aria-expanded', 'true');
  });

  it('retains role order and supports Space activation', async () => {
    const user = userEvent.setup();
    render(<ExperienceSection />);

    const roleButtons = screen.getAllByRole('button');
    expect(roleButtons.map((button) => button.textContent)).toEqual([
      'Site Reliability EngineerHydrolixJun 2024 – May 2026Remote',
      'DevSecOps EngineerOmiliaOct 2022 – Mar 2024Remote / EMEA',
      'Senior DevOps EngineerAsurionOct 2017 – Oct 2022Manila',
      'Network Operations EngineerAsurionJun 2014 – Oct 2017Manila',
    ]);

    roleButtons[1].focus();
    await user.keyboard(' ');

    expect(roleButtons[1]).toHaveAttribute('aria-expanded', 'true');
  });
});
