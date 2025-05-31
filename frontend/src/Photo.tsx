import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Photo as PhotoType, Game } from './utils/types';
import { fetchPhoto } from './utils/photos';
import { startGame } from './utils/game.ts';
import { guess } from './utils/game.ts';
import Nav from './Nav.tsx';
import './css/Photo.css';
import Floater from './Floater.tsx';

function Photo() {
  const { photoId } = useParams<{ photoId: string }>();

  const [photo, setPhoto] = useState<PhotoType | null>(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFloater, setShowFloater] = useState<boolean>(false);
  const [time, setTime] = useState<string>('0:00');
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const passGuess = async (name: string) => {
    console.log(name);
    if (coords) {
      let data = await guess(Number(photoId), name, coords?.x, coords?.y);
      console.log(data);
    }
  };

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

  useEffect(() => {
    let count = 0;
    setInterval(() => {
      count += 1;
      let seconds = count % 60;
      let minutes = (count - seconds) / 60;
      if (seconds < 10) {
        setTime(`${minutes}:0${seconds}`);
      } else {
        setTime(`${minutes}:${seconds}`);
      }
    }, 1000);
  }, [gameData]);

  const handleClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
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
            <h3>{time}</h3>
            <img onClick={handleClick} src={photo.path} alt={photo.title} />
            {showFloater && (
              <Floater
                characterMap={gameData?.characterMap || {}}
                coords={coords}
                dismount={() => setShowFloater(false)}
                passGuess={passGuess}
              />
            )}
          </div>
        )}
      </main>
    </>
  );
}

export default Photo;
