import { Link } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';

/**
 * 404 Not Found page with navigation and a link back to the home page.
 */
function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <h1>Uh oh!</h1>
        <h3>404</h3>
        <p>Seems like you found a page you weren't supposed to.</p>
        <p>
          <Link to="/">Go back to finding Waldo and his friends</Link>{' '}
        </p>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;
