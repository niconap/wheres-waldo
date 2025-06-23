import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import './css/index.css';
import App from './App.tsx';
import Photo from './Photo.tsx';
import Footer from './Footer.tsx';
import Nav from './Nav.tsx';
import Leaderboard from './Leaderboard.tsx';
import NotFound from './NotFound.tsx';

/**
 * The main layout component that includes navigation, outlet for routed content, and footer.
 */
const Layout = () => (
  <>
    <Nav />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/photo/:photoId', element: <Photo /> },
      { path: '/leaderboards', element: <Leaderboard /> },
    ],
    errorElement: <NotFound />,
  },
]);

/**
 * Entry point for the React application. Sets up routing and renders the app.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
