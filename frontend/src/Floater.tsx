import { FloaterProps } from './utils/types';
import './css/Floater.css';

function Floater({
  dismount,
  location,
  characterMap,
  passGuess,
  notFound,
}: FloaterProps) {
  const style = location
    ? {
        left: `${
          location.x > 0.85 * window.innerWidth
            ? 0.85 * window.innerWidth
            : location.x
        }px`,
        top: `${
          location.y > 0.6 * window.innerHeight
            ? 0.6 * window.innerHeight
            : location.y
        }px`,
      }
    : { top: 0 };

  const handleClick = (name: string) => {
    passGuess(name);
    dismount();
  };

  return (
    <div id="floater-menu" style={style as React.CSSProperties}>
      <div id="floater-header">
        <h3>Who's that?</h3>
        <button
          id="close-floater"
          aria-label="Close Floater"
          onClick={dismount}
        >
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
      <div id="floater-content">
        <ol>
          {Object.entries(characterMap ?? {}).map(([id, name]) => {
            if (notFound.includes(Number(id))) {
              return (
                <li key={id}>
                  <img
                    className="character-icon"
                    src={`/${name.toLowerCase()}.png`}
                  />
                  <div>
                    <button onClick={() => handleClick(name)}>{name}</button>
                  </div>
                </li>
              );
            }
          })}
        </ol>
      </div>
    </div>
  );
}

export default Floater;
