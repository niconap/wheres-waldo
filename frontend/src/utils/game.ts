import { Game } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function startGame(photoId: string): Promise<Game> {
  const response = await fetch(`${API_URL}/game/start/${photoId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to start game');
  }
  const data = await response.json();
  return data;
}
