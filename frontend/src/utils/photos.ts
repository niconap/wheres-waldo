import { Photo } from './types'

const API_URL = import.meta.env.VITE_API_URL;
export async function fetchPhotos(): Promise<Photo[]> {
  const response = await fetch(`${API_URL}/photo`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
