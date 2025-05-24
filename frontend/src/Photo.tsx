import { useParams } from 'react-router-dom';
import Nav from './Nav.tsx';

function Photo() {
  const { photoId } = useParams<{ photoId: string }>();
  return (
    <>
      <Nav />
      <div>View photo {photoId}</div>
    </>
  );
}

export default Photo;
