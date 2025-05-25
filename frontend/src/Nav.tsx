import './css/Nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const themeButton = document.getElementById('theme-button');
    if (themeButton) {
      themeButton.textContent = body.classList.contains('dark-mode')
        ? 'Light mode'
        : 'Dark mode';
    }
  };

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
        <button
          id="theme-button"
          aria-label="Toggle Theme"
          onClick={toggleTheme}
        >
          Toggle Theme
        </button>
      </div>
    </nav>
  );
}

export default Nav;
