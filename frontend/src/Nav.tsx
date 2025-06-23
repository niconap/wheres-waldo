import { Link } from 'react-router-dom';

import './css/Nav.css';

/**
 * Navigation bar with links to the home page and leaderboards.
 */
function Nav() {
  return (
    <nav>
      <Link to="/">
        <h1>Where's Waldo?</h1>
      </Link>
      <div id="menu">
        <ul id="nav-link">
          <li>
            <Link to="/leaderboards">Leaderboards</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
