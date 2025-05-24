import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '../src/App';

test('renders the Nav bar', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();
});

test('renders the title and description', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  const titleElement = screen.getByRole('heading', {
    name: /oh no\!/i,
  });

  const descriptionElement = screen.getByText(
    /where have waldo and his friends gone\? can you help find them\?/i
  );

  expect(titleElement).toBeInTheDocument();
  expect(descriptionElement).toBeInTheDocument();
});
