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
import AddAddressPage from "./pages/AddAddressPage";
import UserOrders from "./pages/UserOrders";
import { fetchCart } from "./features/cart/cartSlice";

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

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart()); 
    }
  }, [user, dispatch]);


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
        <Route path="/" element={<ProtectedRoute isAuth={!!user?.user}><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute isAuth={!!user?.user}><Products /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute isAuth={!!user?.user}><SingleProduct /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute isAuth={!!user?.user}><UserOrders /></ProtectedRoute>} />
        <Route path="/add-address" element={<ProtectedRoute isAuth={!!user?.user}><AddAddressPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute isAuth={!!user?.user}><Cart /></ProtectedRoute>} />
        <Route path="/login" element={user?.user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signin" element={user?.user ? <Navigate to="/" replace /> : <Signin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );

}

export default App;
