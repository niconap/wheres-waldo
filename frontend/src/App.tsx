import Nav from './Nav';
import './css/App.css';
import PhotoLayout from './PhotoLayout';

function App() {
  return (
    <>
      <Nav />
      <main>
        <h1>Oh no!</h1>
        <p>Where have Waldo and his friends gone? Can you help find them?</p>
        <PhotoLayout />
      </main>
    </>
  );
}

export default App;
