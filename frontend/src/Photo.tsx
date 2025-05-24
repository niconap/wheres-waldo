import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Photo as PhotoType } from './utils/types';
import { fetchPhoto } from './utils/photos';
import Nav from './Nav.tsx';
import './Photo.css';

function Photo() {
  const { photoId } = useParams<{ photoId: string }>();

  const [photo, setPhoto] = useState<PhotoType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!photoId) {
          setError('Photo ID is required');
          return;
        }
        const photo = await fetchPhoto(photoId);
        setPhoto(photo);
      } catch {
        setError('Failed to load photo');
      }
    };
    fetchData();
  }, [photoId]);

  return (
    <>
      <Nav />
      <main>
        {error && <div className="error">Error: {error}</div>}
        {!photo && !error && <div>Loading...</div>}
        {photo && (
          <div id="photo">
            <h1>{photo.title}</h1>
            <img src={photo.path} alt={photo.title} />
          </div>
        )}
      </main>
    </>
  );
}

export default Photo;
