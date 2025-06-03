import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createEntry } from './utils/leaderboard';
import './css/Finished.css';

function Finished({ score }: { score: number }) {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.length < 3) {
      setError('Your name must be at least three characters long');
      return;
    }
    setError('');
  };

  const handleClick = async () => {
    if (name.length < 3) {
      setError('Your name must be at least three characters long');
      return;
    }
    await createEntry(name);
    navigate('/leaderboards');
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
      <button onClick={handleClick} name="Submit name">
        Submit
      </button>
    </div>
  );
}

export default Finished;
