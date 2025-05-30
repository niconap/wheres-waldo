import { Game, Guess } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function startGame(photoId: string): Promise<Game> {
  const response = await fetch(`${API_URL}/game/start/${photoId}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to start game');
  }
  const data = await response.json();
  return data;
}

export async function guess(
  photoId: number,
  name: string,
  x: number,
  y: number
): Promise<Guess> {
  const response = await fetch(`${API_URL}/game/guess/${photoId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      x,
      y,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to guess character');
  }
  const data = await response.json();
  return data;
}
