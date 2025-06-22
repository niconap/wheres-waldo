import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchPhotos } from './utils/photos';
import { Photo } from './utils/types';
import './css/PhotoLayout.css';

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
        <article key={photo.id} className="photo">
          <h2>
            <ion-icon name="image-outline"></ion-icon>
            <span>{photo.title}</span>
          </h2>
          <img
            src={photo.path.replace(/\/([^/]+)/, '/thumbnail_$1')}
            alt={photo.title}
          />
          <div>
            <button
              aria-label="Play"
              onClick={() => navigate(`/photo/${photo.id}`)}
            >
              <ion-icon name="play-outline"></ion-icon>
              <span>Play</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PhotoLayout;
