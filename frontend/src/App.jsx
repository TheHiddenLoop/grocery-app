import { Routes, Route, Navigate } from "react-router";

import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signin from "./pages/Signin";

function App() {
  const user = true;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product" element={<SingleProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />

      <Route
        path="/cart"
        element={user ? <Cart /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
