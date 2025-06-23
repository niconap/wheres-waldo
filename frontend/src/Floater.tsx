import './css/Floater.css';
import { FloaterProps } from './utils/types';

/**
 * A floater used for selecting characters. It should appear after the user
 * clicks on a photo.
 *
 * @param {Object} props - The props for the Floater component.
 * @param {function} props.dismount - A function used for dismounting the
 * Floater.
 * @param {Object} props.location - An object containing the location of the
 * user's click.
 * @param {number} props.location.x - The x-coordinate of the user's click.
 * @param {number} props.location.y - The y-coordinate of the user's click.
 * @param {function} props.passGuess - A function for passing the user's guess
 * to the parent component.
 * @param {number[]} props.notFound - An array containing the ids of characters
 * that have not been found yet.
 */
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

  /**
   * A function for handling a character selection by the user.
   *
   * @param {string} name - The name of the character that the user guessed.
   */
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
                    <button name={name} onClick={() => handleClick(name)}>
                      {name}
                    </button>
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
