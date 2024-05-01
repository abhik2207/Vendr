import React, { useEffect } from 'react';
import './App.css';

import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// eslint-disable-next-line no-unused-vars
import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Protected from './features/auth/components/Protected';
import PageNotFound from './pages/PageNotFound';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthAsync, selectLoggedInUser, selectUserChecked } from './features/auth/authSlice';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import Logout from './features/auth/components/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminHomepage from './pages/AdminHomepage';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StripeCheckout from './pages/StripeCheckout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected>
      <Homepage />
    </Protected>,
  },
  {
    path: "/admin",
    element: <ProtectedAdmin>
      <AdminHomepage />
    </ProtectedAdmin>,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cart",
    element: <Protected>
      <CartPage />
    </Protected>,
  },
  {
    path: "/checkout",
    element: <Protected>
      <CheckoutPage />
    </Protected>,
  },
  {
    path: "/product-detail/:id",
    element: <Protected>
      <ProductDetailPage />
    </Protected>,
  },
  {
    path: "/admin/product-detail/:id",
    element: <ProtectedAdmin>
      <AdminProductDetailPage />
    </ProtectedAdmin>,
  },
  {
    path: "/admin/product-form",
    element: <ProtectedAdmin>
      <AdminProductFormPage />
    </ProtectedAdmin>,
  },
  {
    path: "/admin/product-form/edit/:id",
    element: <ProtectedAdmin>
      <AdminProductFormPage />
    </ProtectedAdmin>,
  },
  {
    path: "/admin/orders",
    element: <ProtectedAdmin>
      <AdminOrdersPage />
    </ProtectedAdmin>,
  },
  {
    path: "/order-success/:id",
    element: <Protected>
      <OrderSuccessPage />
    </Protected>
  },
  {
    path: "/stripe-checkout",
    element: <Protected>
      <StripeCheckout />
    </Protected>
  },
  {
    path: "/orders",
    element: <Protected>
      <UserOrdersPage />
    </Protected>
  },
  {
    path: "/profile",
    element: <Protected>
      <UserProfilePage />
    </Protected>
  },
  {
    path: "/logout",
    element: <Logout />
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user]);

  return (
    <div id="main-body">
      {userChecked &&
        <RouterProvider router={router} />
      }
      <ToastContainer />
    </div>
  );
}

export default App;
