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
import { selectLoggedInUser } from './features/auth/authSlice';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected>
      <Homepage />
    </Protected>,
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
    path: "/order-success/:id",
    element: <OrderSuccessPage />
  },
  {
    path: "/orders",
    element: <UserOrdersPage />
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    if(user) {
      dispatch(fetchItemsByUserIdAsync(+user.id));
    }
  }, [dispatch, user]);

  return (
    <div id="main-body">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
