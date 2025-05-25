import Nav from './Nav';
import './css/App.css';
import PhotoLayout from './PhotoLayout';

function App() {
  return (
    <>
      <Nav />
      <main>
        <h1>Oh no!</h1>
        <h4>Where have Waldo and his friends gone? Can you help find them?</h4>
        <PhotoLayout />
      </main>
    </>
  );
}

export default App;
