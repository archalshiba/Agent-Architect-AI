import { render, screen } from '@testing-library/react';
import HeaderUnauthenticated from '@/components/HeaderUnauthenticated';

describe('HeaderUnauthenticated', () => {
  it('renders the Agent Architect AI logo and navigation links', () => {
    render(<HeaderUnauthenticated />);

    expect(screen.getByText('Agent Architect AI')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Features/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pricing/i })).toBeInTheDocument();
  });
});