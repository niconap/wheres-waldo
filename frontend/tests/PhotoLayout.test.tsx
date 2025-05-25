import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';

import PhotoLayout from '../src/PhotoLayout';

beforeEach(() => {
  vi.resetAllMocks();
});

test('renders loading state, then photos from API', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, title: 'At the beach', path: '/beach.jpg' },
      { id: 2, title: 'In the city', path: '/city.jpg' },
    ],
  } as Response);

  render(
    <MemoryRouter>
      <PhotoLayout />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  const cards = await screen.findAllByRole('article');
  expect(cards).toHaveLength(2);
  expect(cards[0]).toHaveTextContent('At the beach');
  expect(cards[1]).toHaveTextContent('In the city');
});

test('renders error message when fetch fails', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({ error: 'Server error' }),
  } as Response);

  render(
    <MemoryRouter>
      <PhotoLayout />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

test('navigates to /photo/:photoId when button is clicked', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { id: 1, title: 'At the beach', path: '/beach.jpg' },
      { id: 2, title: 'In the city', path: '/city.jpg' },
    ],
  } as Response);

  render(
    <MemoryRouter>
      <PhotoLayout />
      <LocationDisplay />
    </MemoryRouter>
  );

  expect(await screen.findByText('At the beach')).toBeInTheDocument();

  const button = screen.getAllByRole('button', { name: /view photo/i })[0];
  await userEvent.click(button);
  expect(screen.getByTestId('location')).toHaveTextContent('/photo/1');
});
