import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import { Photo as PhotoType, Game } from './utils/types';
import { fetchPhoto } from './utils/photos';
import { startGame } from './utils/game.ts';
import { guess } from './utils/game.ts';
import './css/Photo.css';
import Floater from './Floater.tsx';
import Finished from './Finished.tsx';

function Photo() {
  const { photoId } = useParams<{ photoId: string }>();
  const intervalId = useRef<number | null>(null);

  const [photo, setPhoto] = useState<PhotoType | null>(null);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFloater, setShowFloater] = useState<boolean>(false);
  const [time, setTime] = useState<string>('0:00');
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const passGuess = async (name: string) => {
    if (coords) {
      let data = await guess(Number(photoId), name, coords?.x, coords?.y);
      if (data.status.notFound.length === 0 && intervalId.current) {
        setFinished(true);
        if (data.score) {
          setScore(data.score);
        }
        clearInterval(intervalId.current);
      }
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
          setStarted(true);
        }
      } catch (error) {
        setError('Failed to start game');
      }
    };
    fetchData();
  }, [photoId]);

  useEffect(() => {
    if (started) {
      let count = 0;
      let id = setInterval(() => {
        count += 1;
        let seconds = count % 60;
        let minutes = (count - seconds) / 60;
        if (seconds < 10) {
          setTime(`${minutes}:0${seconds}`);
        } else {
          setTime(`${minutes}:${seconds}`);
        }
      }, 1000);
      intervalId.current = id;
    }
  }, [started]);

  const handleClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
    setShowFloater(true);
  };

  return (
    <>
      <main>
        {error && <div className="error">Error: {error}</div>}
        {!photo && !error && <div>Loading...</div>}
        {photo && (
          <div className={finished ? 'blur' : ''} id="photo">
            <h1>{photo.title}</h1>
            <h3>{time}</h3>
            <img onClick={handleClick} src={photo.path} alt={photo.title} />
            {showFloater && !finished && (
              <Floater
                characterMap={gameData?.characterMap || {}}
                coords={coords}
                dismount={() => setShowFloater(false)}
                passGuess={passGuess}
              />
            )}
          </div>
        )}
        {finished && <Finished score={score} />}
      </main>
    </>
  );
}

export default Photo;
