import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Leaderboard from '../src/Leaderboard';
import * as photosModule from '../src/utils/photos';
import * as leaderboardModule from '../src/utils/leaderboard';

test('shows loading, then empty leaderboard message', async () => {
  vi.spyOn(photosModule, 'fetchPhotos').mockResolvedValueOnce([
    { id: 1, title: 'Test Photo', path: '/' },
  ]);

  vi.spyOn(leaderboardModule, 'fetchLeaderboard').mockResolvedValueOnce({
    id: 1,
    photoId: 1,
    Entry: [],
  });

  render(
    <MemoryRouter>
      <Leaderboard />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(
      screen.getByText(/leaderboard is empty, be the first one/i)
    ).toBeInTheDocument();
  });

  expect(screen.getByRole('combobox')).toBeInTheDocument();
});
