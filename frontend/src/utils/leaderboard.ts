import { Leaderboard } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function createEntry(name: string): Promise<{ score: number }> {
  if (!localStorage.getItem('gameToken')) {
    throw new Error('Game not started');
  }
  const response = await fetch(`${API_URL}/leaderboard/entry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('gameToken')}`,
    },
    body: JSON.stringify({
      name: name,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to guess character');
  }
  const data = await response.json();
  return data;
}

export async function fetchLeaderboard(id: number): Promise<Leaderboard> {
  const response = await fetch(`${API_URL}/leaderboard/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to get leaderboard');
  }
  const leaderboard = await response.json();
  console.log(leaderboard);
  return leaderboard;
}
