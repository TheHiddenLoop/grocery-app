import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signin from "./pages/SignUp";
import {selectAuthUser,selectAuthStatusCheck} from "./features/auth/authSelector";
import { checkAuth } from "./features/auth/authSlice";
import { Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const user = useSelector(selectAuthUser);
  const authStatus = useSelector(selectAuthStatusCheck);
  const dispatch = useDispatch();  

  const cartCount = user?.user?.cartItems?.reduce(
  (sum, item) => sum + item.quantity,
  0
) || 0;

  

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (authStatus === "loading" || authStatus === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary font-robot">
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
        <Route path="/" element={<ProtectedRoute isAuth={!!user?.user}><Home cartCount = {cartCount} /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute isAuth={!!user?.user}><Products /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute isAuth={!!user?.user}><SingleProduct /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute isAuth={!!user?.user}><Cart /></ProtectedRoute>} />
        <Route path="/login" element={user?.user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signin" element={user?.user ? <Navigate to="/" replace /> : <Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );

}

export default App;
