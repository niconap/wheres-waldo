import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../src/Footer.tsx';

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        media: '',
        onchange: null,
      };
    };
});

describe('Footer', () => {
  it('should contain a button to toggle dark/light mode', () => {
    render(<Footer />);
    const toggleButton = screen.getByRole('button', {
      name: /toggle theme/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should contain a disclaimer', () => {
    render(<Footer />);
    const disclaimer = screen.getByText(
      /this project is made for educational purposes only/i
    );
    expect(disclaimer).toBeInTheDocument();
  });

  it('should contain two links', () => {
    render(<Footer />);
    const gitHubLink = screen.getByRole('link', { name: /github repository/i });
    expect(gitHubLink).toHaveAttribute(
      'href',
      'https://www.github.com/niconap/wheres-waldo'
    );
    expect(gitHubLink).toHaveClass('external-link');
    const websiteLink = screen.getByRole('link', {
      name: /portfolio website/i,
    });
    expect(websiteLink).toHaveAttribute('href', 'https://niconap.dev');
    expect(websiteLink).toHaveClass('external-link');
  });
});
