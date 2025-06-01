import { FloaterProps } from './utils/types';
import './css/Floater.css';

function Floater({ coords, dismount, characterMap, passGuess }: FloaterProps) {
    const style = coords
        ? {
              left: `${coords.x > 80 ? 80 : coords.x}%`,
              top: `${coords.y}%`,
          }
        : {};

    const handleClick = (name: string) => {
        passGuess(name);
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
                    {Object.entries(characterMap ?? {}).map(([id, name]) => (
                        <li key={id}>
                            <button onClick={() => handleClick(name)}>
                                {name}
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default Floater;
