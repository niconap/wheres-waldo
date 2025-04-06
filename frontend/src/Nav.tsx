import './Nav.css';

function Nav() {
  return (
    <nav>
      <h1>Where's Waldo?</h1>
      <ul>
        <li>
          <a href="#">Leaderboards</a>
        </li>
      </ul>
      <button aria-label="Toggle Theme">Toggle Theme</button>
    </nav>
  );
}

export default Nav;
