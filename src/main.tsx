import { StrictMode } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App/App.tsx';
import Character from '@/pages/character/Character.tsx';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/main' replace />, // Redirect root to /main
  },
  {
    path: '/main',
    element: <App />, // Main application component
  },
  {
    path: '/character/:id',
    element: <Character />, // Character component
  },
  {
    path: '*',
    element: <div>Not Found</div>, // Fallback for undefined routes
  },
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={createBrowserRouter(routes)} />
    </MantineProvider>
  </StrictMode>
);
