import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Photo from '../src/Photo.tsx';

beforeEach(() => {
  vi.resetAllMocks();
});

test('renders loading state, then photo info from API', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      id: 1,
      title: 'At the beach',
      path: '/beach.jpg',
    }),
  } as Response);

  render(
    <MemoryRouter initialEntries={['/photo/1']}>
      <Routes>
        <Route path="/photo/:photoId" element={<Photo />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText('At the beach')).toBeInTheDocument();
  expect(screen.getByAltText('At the beach')).toBeInTheDocument();
});

test('renders error message when fetch fails', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: false,
    status: 404,
    json: async () => ({ error: 'Not found' }),
  } as Response);

  render(
    <MemoryRouter initialEntries={['/photo/1']}>
      <Routes>
        <Route path="/photo/:photoId" element={<Photo />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
