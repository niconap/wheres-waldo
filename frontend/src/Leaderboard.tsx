import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { Leaderboard as LeaderboardType, Photo } from './utils/types';
import { fetchPhotos } from './utils/photos';
import { fetchLeaderboard } from './utils/leaderboard';
import './css/Leaderboard.css';

function Leaderboard() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardType | null>(null);
  const [error, setError] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [choice, setChoice] = useState<number>(0);
  const [searchParams, _] = useSearchParams();
  const id = Number(searchParams.get('id'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photos = await fetchPhotos();
        if (photos.length > 0) {
          if (id) {
            setChoice(id);
          } else {
            setChoice(photos[0].id);
          }
        }
        setPhotos(photos);
      } catch {
        setError('Failed to load photos');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setError('');
    const fetchData = async () => {
      try {
        const leaderboard = await fetchLeaderboard(choice);
        setLeaderboard(leaderboard);
        setLoaded(true);
      } catch {
        setError('Failed to fetch leaderboard');
      }
    };
    if (photos.length > 0) {
      fetchData();
    }
  }, [choice, loaded]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChoice(Number(e.target.value));
  };

  return (
    <main>
      <h1>Leaderboards</h1>
      <p className="error-msg">{error}</p>
      {!loaded && <p>Loading...</p>}
      {photos.length > 0 && (<select
        value={choice}
        onChange={handleSelect}
        aria-label="Select a photo"
      >
        {photos?.map((photo) => {
          return (
            <option key={photo.id} value={photo.id}>
              {photo.title}
            </option>
          );
        })}
      </select>)}
      {leaderboard && (
        <div id="leaderboard">
          <div>
            <button
              aria-label="Play"
              onClick={() => navigate(`/photo/${choice}`)}
            >
              <ion-icon name="play-outline"></ion-icon>
              <span>Try this level</span>
            </button>
          </div>
          {leaderboard.Entry.length > 0 && (<ol>
            {leaderboard.Entry.map((entry) => {
              return (
                <li className="leaderboard-entry">
                  <div>
                    <h3>{entry.name}</h3>
                    <p>{entry.score / 1000} seconds</p>
                  </div>
                </li>
              );
            })}
          </ol>)}
          {leaderboard.Entry.length === 0 && (
            <p>Leaderboard is empty, be the first one by completing the level!</p>
          )}
        </div>
      )}
    </main>
  );
}

export default Leaderboard;
