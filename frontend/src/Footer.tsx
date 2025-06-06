import './css/Footer.css';
import { useState, useEffect } from 'react';

function Footer() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    setTheme(initialTheme);
    document.body.classList.toggle('dark-mode', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <footer>
      <div>
        <p>This project is made for educational purposes only</p>
        <p>
          <a
            className="external-link"
            aria-label='Portfolio website'
            href="https://niconap.dev"
            target="_blank"
          >
            <span>Made by Nico</span>
            <ion-icon name="exit-outline"></ion-icon>
          </a>
        </p>
        <p>
          <a
            className="external-link"
            aria-label='GitHub repository'
            href="https://www.github.com/niconap/wheres-waldo"
            target="_blank"
          >
            <span>View on GitHub</span>
            <ion-icon name="exit-outline"></ion-icon>
          </a>
        </p>
      </div>
      <button
        title="Toggle between dark and light mode"
        id="theme-button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        {theme === 'light' && <ion-icon name="sunny-outline"></ion-icon>}
        {theme === 'dark' && <ion-icon name="moon-outline"></ion-icon>}
      </button>
    </footer>
  );
}

export default Footer;
