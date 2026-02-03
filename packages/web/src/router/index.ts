// import React from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Layout from '@components/layout/Layout'
// import MerchantLayout from '@components/layout/MerchantLayout'
// import HomePage from '@pages/user/HomePage'
// import ProductDetailPage from '@pages/user/ProductDetailPage'
// import ProductListPage from '@pages/user/ProductListPage'
// import CartPage from '@pages/user/CartPage'
// import MerchantLoginPage from '@pages/merchant/MerchantLoginPage'
// import MerchantDashboardPage from '@pages/merchant/DashboardPage'
// import NotFoundPage from '@pages/NotFoundPage'
// import ProtectedRoute from '@components/common/ProtectedRoute'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: 'products', element: <ProductListPage /> },
//       { path: 'products/:id', element: <ProductDetailPage /> },
//       { path: 'cart', element: <CartPage /> },
//     ],
//   },
//   {
//     path: '/merchant',
//     children: [
//       { path: 'login', element: <MerchantLoginPage /> },
//       {
//         path: '',
//         element: (
//           <ProtectedRoute requireMerchant>
//             <MerchantLayout />
//           </ProtectedRoute>
//         ),
//         children: [
//           { index: true, element: <MerchantDashboardPage /> },
//           { path: 'products', element: <div>商品管理页面</div> },
//           { path: 'orders', element: <div>订单管理页面</div> },
//         ],
//       },
//     ],
//   },
//   {
//     path: '*',
//     element: <NotFoundPage />,
//   },
// ])

// export const AppRouter: React.FC = () => {
//   return <RouterProvider router={router} />
// }
