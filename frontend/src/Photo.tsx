import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Photo as PhotoType, Game } from './utils/types';
import { fetchPhoto } from './utils/photos';
import { startGame } from './utils/game.ts';
import Nav from './Nav.tsx';
import './css/Photo.css';
import Floater from './Floater.tsx';

function Photo() {
  const { photoId } = useParams<{ photoId: string }>();

  const [photo, setPhoto] = useState<PhotoType | null>(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFloater, setShowFloater] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

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

      try {
        if (photoId) {
          const gameData = await startGame(photoId);
          setGameData(gameData);
        }
      } catch (error) {
        console.error('Error starting game:', error);
        setError('Failed to start game');
      }
    };
    fetchData();
  }, [photoId]);

  const handleClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(gameData);
    setCoords({ x, y });
    setShowFloater(true);
  };

  return (
    <>
      <Nav />
      <main>
        {error && <div className="error">Error: {error}</div>}
        {!photo && !error && <div>Loading...</div>}
        {photo && (
          <div id="photo">
            <h1>{photo.title}</h1>
            <img onClick={handleClick} src={photo.path} alt={photo.title} />
            {showFloater && (
              <Floater
                characterMap={gameData?.characterMap || {}}
                coords={coords}
                dismount={() => setShowFloater(false)}
              />
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default Photo;
