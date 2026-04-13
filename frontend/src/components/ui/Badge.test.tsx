import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Verified</Badge>);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('applies success variant classes', () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge).toHaveClass('bg-successLight');
  });

  it('applies danger variant classes', () => {
    render(<Badge variant="danger">Error</Badge>);
    const badge = screen.getByText('Error');
    // Actual implementation uses bg-red-100 for danger
    expect(badge).toHaveClass('bg-red-100');
  });
});
