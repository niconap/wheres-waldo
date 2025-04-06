import './Nav.css';

function Nav() {
  return (
    <nav>
      <h1>Where's Waldo?</h1>
      <div>
        <ul id="nav-link">
          <li>
            <a href="#">Leaderboards</a>
          </li>
        </ul>
        <button id="theme-button" aria-label="Toggle Theme">Toggle Theme</button>
      </div>
    </nav>
  );
}

export default Nav;
