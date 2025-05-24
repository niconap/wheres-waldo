import './Nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <Link to="/">
        <h1>Where's Waldo?</h1>
      </Link>
      <div>
        <ul id="nav-link">
          <li>
            <Link to="/leaderboards">Leaderboards</Link>
          </li>
        </ul>
        <button id="theme-button" aria-label="Toggle Theme">
          Toggle Theme
        </button>
      </div>
    </nav>
  );
}

export default Nav;
