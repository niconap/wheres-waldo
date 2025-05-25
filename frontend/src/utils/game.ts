const API_URL = import.meta.env.VITE_API_URL;

export async function startGame(photoId: string): Promise<void> {
  const response = await fetch(`${API_URL}/game/start/${photoId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to start game');
  }
  const json = await response.json();
  console.log('Game started:', json);
}
