import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Nav from '../src/Nav.tsx';

describe('Navigation Bar', () => {
  it('should render the main title "Where\'s Waldo?"', () => {
    render(<Nav />);
    const mainTitle = screen.getByText(/Where's Waldo\?/i);
    expect(mainTitle).toBeInTheDocument();
  });

  it('should contain a link to "Leaderboards"', () => {
    render(<Nav />);
    const leaderboardLink = screen.getByRole('link', { name: /Leaderboards/i });
    expect(leaderboardLink).toBeInTheDocument();
  });

  it('should contain a button to toggle dark/light mode', () => {
    render(<Nav />);
    const toggleButton = screen.getByRole('button', {
      name: /toggle theme/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });
});
