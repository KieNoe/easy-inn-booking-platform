import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@pages/LoginPage';
import HotelEditPage from '@pages/HotelEditPage';
// import HotelManagementPage from '@/pages/HotelManagementPage'
import NotFoundPage from '@pages/NotFoundPage';
// import ProtectedRoute from '@components/common/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <HomePage />, // 登录页面
  },
  {
    path: '/hotel-edit',
    element: <HotelEditPage />,
  },
  //   {
  //     path: '/hotel-management',
  //     element: (
  //       <ProtectedRoute>
  //         <HotelManagementPage />
  //       </ProtectedRoute>
  //     ),
  //   },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
