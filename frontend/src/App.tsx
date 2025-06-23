import './css/App.css';
import PhotoLayout from './PhotoLayout';

/**
 * The component containing the homepage, rendering a title and the photo
 * layout.
 */
function App() {
  return (
    <>
      <main>
        <h1>Oh no!</h1>
        <h4>Where have Waldo and his friends gone? Can you help find them?</h4>
        <PhotoLayout />
      </main>
    </>
  );
}

export default App;
