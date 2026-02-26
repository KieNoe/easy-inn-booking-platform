import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import HotelEditPage from '@pages/HotelEditPage';
import HotelManagementPage from '@/pages/HotelManagementPage';
import NotFoundPage from '@pages/NotFoundPage';
import ProtectedRoute from '@components/common/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/hotel',
    element: <LoginPage />,
  },
  {
    path: '/hotel/login',
    element: <LoginPage />, // 登录页面
  },
  {
    path: '/hotel/hotel-edit/:id?',
    element: <HotelEditPage />,
  },
  {
    path: '/hotel/hotel-management',
    element: (
      <ProtectedRoute>
        <HotelManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
