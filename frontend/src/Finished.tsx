import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createEntry } from './utils/leaderboard';
import { FinishedProps } from './utils/types';
import './css/Finished.css';

/**
 * A floater used for submitting a score to the leaderboard of the
 * corresponding photo.
 *
 * @param {Object} props - The props for the Finished component.
 * @param {number} props.score - The user's score.
 * @param {number} props.photoId - The ID of the photo.
 */
function Finished({ score, photoId }: FinishedProps) {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  /**
   * Handle a change in the name input, storing its value in the name variable.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.length < 3) {
      setError('Your name must be at least three characters long');
      return;
    }
    setError('');
  };

  /**
   * Handle the submission of the form where the user entered their name.
   */
  const handleClick = async () => {
    if (name.length < 3) {
      setError('Your name must be at least three characters long');
      return;
    }
    await createEntry(name);
    navigate(`/leaderboards?id=${photoId}`);
  };

  return (
    <div id="finished">
      <h3>You found everyone!</h3>
      <p>You did it in {score / 1000} seconds!</p>
      <p>Enter your name below to enter the leaderboard</p>
      <input
        className={error ? 'error-input' : ''}
        value={name}
        placeholder="Your name..."
        onChange={handleChange}
      />
      {error && <p className="error-msg">{error}</p>}
      <button
        onClick={handleClick}
        name="Submit name"
        className="external-link"
      >
        <span>Submit</span>
        <ion-icon name="exit-outline"></ion-icon>
      </button>
    </div>
  );
}

export default Finished;
