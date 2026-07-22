import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import DesignsPage from './DesignsPage';

describe('DesignsPage', () => {
  it('renders the supplied CI/CD architecture as the first design', () => {
    render(
      <MemoryRouter>
        <DesignsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Designs' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CI/CD Pipeline Architecture' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /secure ci\/cd pipeline architecture/i })).toHaveAttribute(
      'src',
      '/images/designs/cicd-pipeline-architecture.png',
    );
  });

  it('opens the diagram in an accessible enlarged view', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DesignsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'View CI/CD Pipeline Architecture full size' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CI/CD Pipeline Architecture — full size' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
