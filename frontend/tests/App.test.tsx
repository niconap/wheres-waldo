import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

test('renders the Nav bar', () => {
  render(<App />);
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();
});

test('renders the title and description', () => {
  render(<App />);

  const titleElement = screen.getByRole('heading', {
    name: /oh no\!/i,
  });

  const descriptionElement = screen.getByText(
    /where have waldo and his friends gone\? can you help find them\?/i
  );

  expect(titleElement).toBeInTheDocument();
  expect(descriptionElement).toBeInTheDocument();
});
