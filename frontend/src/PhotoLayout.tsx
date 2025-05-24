import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchPhotos } from './utils/photos';
import { Photo } from './utils/types';
import './PhotoLayout.css';

function PhotoLayout() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photos = await fetchPhotos();
        setPhotos(photos);
      } catch {
        setError('Failed to load photos');
      }
    };

    fetchData();
  }, []);

  if (photos.length === 0 && !error) {
    return <div id="photo-layout">Loading...</div>;
  }

  if (error) {
    return <div id="photo-layout">Error: {error}</div>;
  }

  return (
    <div id="photo-layout">
      {photos.map((photo) => (
        <div key={photo.id} className="photo">
          <h2>{photo.title}</h2>
          <img src={photo.path} alt={photo.title} />
          <button
            aria-label="View photo"
            onClick={() => navigate(`/photo/${photo.id}`)}
          >
            Play
          </button>
        </div>
      ))}
    </div>
  );
}

export default PhotoLayout;
