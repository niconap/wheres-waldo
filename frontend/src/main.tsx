import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import './css/index.css';
import App from './App.tsx';
import Photo from './Photo.tsx';
import Footer from './Footer.tsx';
import Nav from './Nav.tsx';
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
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
