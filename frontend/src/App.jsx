import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signin from "./pages/SignUp";
import {
  selectAuthUser,
  selectAuthStatusCheck,
} from "./features/auth/authSelector";
import { checkAuth } from "./features/auth/authSlice";
import { Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthStatusCheck);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  console.log(user);


  if (loading === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgPrimary font-robot">
        <Loader
          className="h-12 w-12 animate-spin text-primary"
          strokeWidth={2.5}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/products"
          element={user ? <Products /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/product/:id"
          element={user ? <SingleProduct /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" replace /> : <Signin />}
        />

        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
